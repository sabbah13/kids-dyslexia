// js/main.js

// --- Server-Side Error Logging ---
async function logErrorToServer(errorData) {
    // Avoid logging if running from file:// protocol (local dev without server)
    if (window.location.protocol === 'file:') {
        // console.warn("Cannot log errors to server when running from file:// protocol.");
        return; 
    }
    try {
        const response = await fetch('/log', { // Assumes server is running on the same origin
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorData),
        });
        if (!response.ok) {
            console.error('Failed to send error log to server', response.status, response.statusText);
        }
    } catch (networkError) {
        console.error('Network error while sending error log:', networkError);
    }
}

// Global Error Handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error caught:", message, "at", source, lineno, colno, error);
    const errorData = {
        type: 'uncaughtException',
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        stack: error ? error.stack : null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    logErrorToServer(errorData);
    return false; // Let default browser error handling run as well
};

// Unhandled Promise Rejection Handler
window.addEventListener('unhandledrejection', function(event) {
    console.error("Unhandled promise rejection:", event.reason);
    const errorData = {
        type: 'unhandledRejection',
        message: event.reason instanceof Error ? event.reason.message : JSON.stringify(event.reason),
        stack: event.reason instanceof Error ? event.reason.stack : null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    logErrorToServer(errorData);
});

// --- End Server-Side Error Logging ---

// --- Game Manager --- V2
const gameManager = {
    wordsData: [],
    isRevealReady: false,
    currentSlideId: null,

    async init() {
        console.log("GameManager: Initializing...");
        // Load data and store it within the manager
        this.wordsData = await loadWordData();

        if (!this.wordsData) {
            console.error("GameManager: Failed to load necessary game data (wordsData). Initialization aborted.");
            this.displayLoadError();
            return; // Stop initialization
        }
        console.log("GameManager: Data loaded successfully.");

        // Initialize Reveal.js
        try {
            Reveal.initialize({
                hash: true, 
                history: false, 
                controls: true, 
                progress: true, 
                center: false, 
                transition: 'slide', 
                touch: false, 
                dependencies: [] 
            });
            console.log("GameManager: Reveal.js initialized.");

            // Setup Reveal listeners to call manager methods
            Reveal.addEventListener('ready', this.onRevealReady.bind(this));
            Reveal.addEventListener('slidechanged', this.onSlideChanged.bind(this));

        } catch (e) {
            console.error("GameManager: Error initializing Reveal.js:", e);
            logErrorToServer({ type: 'revealInitError', message: e.message, stack: e.stack });
            this.displayLoadError("Ошибка инициализации презентации.");
        }
    },

    onRevealReady(event) {
        console.log("GameManager: Reveal ready.");
        this.isRevealReady = true;
        this.handleSlideChange(event.currentSlide); // Init game for initial slide
    },

    onSlideChanged(event) {
        console.log("GameManager: Slide changed.");
        this.handleSlideChange(event.currentSlide);
    },

    handleSlideChange(currentSlideElement) {
        if (!this.isRevealReady || !currentSlideElement) {
            // console.log("GameManager: Ignoring slide change before ready or no slide element.");
            return;
        }
        const newSlideId = currentSlideElement.id;
        console.log(`GameManager: Handling slide change to -> ${newSlideId}`);

        // Optional: Add cleanup logic for the previous game if needed
        // if (this.currentSlideId && this.currentSlideId !== newSlideId) {
        //     this.cleanupGame(this.currentSlideId);
        // }

        this.currentSlideId = newSlideId;
        this.initializeGameForSlide(newSlideId);
    },

    initializeGameForSlide(slideId) {
        console.log(`GameManager: Attempting to initialize game for slide: ${slideId}`);
        // Log the data received by this function before passing it on
        console.log(`GameManager: Data received for init - Words:`, this.wordsData);

        try {
            switch (slideId) {
                case 'game-scrambled-letters':
                    if (typeof initScrambledLettersGame === 'function') {
                        // Pass data stored in the manager
                        initScrambledLettersGame(this.wordsData);
                    } else {
                        console.error('initScrambledLettersGame function not found!');
                    }
                    break;
                case 'game-catch-syllables':
                    if (typeof initCatchSyllablesGame === 'function') {
                        // Pass the unified wordsData to Catch Syllables game
                        initCatchSyllablesGame(this.wordsData);
                    } else {
                        console.error('initCatchSyllablesGame function not found!');
                    }
                    break;
                // Add cases for other game IDs
                default:
                    // console.log('GameManager: No specific game initialization for slide:', slideId);
                    break;
            }
        } catch (error) {
            console.error(`GameManager: Error initializing game for slide ${slideId}:`, error);
            logErrorToServer({ 
                type: 'gameInitError', 
                slideId: slideId, 
                message: error.message, 
                stack: error.stack 
            });
        }
    },

    displayLoadError(message = "Ошибка загрузки данных для игр. Пожалуйста, обновите страницу или попробуйте позже.") {
         document.body.innerHTML = `<div style='padding: 20px; text-align: center; font-size: 1.2em; color: red;'>${message}</div>`;
    }
};
// --- End Game Manager ---

// --- Audio Utilities ---
function playSound(soundId) {
    const soundElement = document.getElementById(soundId);
    if (soundElement instanceof HTMLAudioElement) {
        // Reset playback to allow rapid re-triggering
        soundElement.currentTime = 0;
        soundElement.play().catch(error => {
            // Autoplay restrictions might prevent playback before user interaction
            // We attempt to unlock audio context on first interaction, but log errors just in case.
            console.error(`Error playing sound '${soundId}':`, error);
            // Optionally log to server
             logErrorToServer({ type: 'audioPlayError', soundId: soundId, message: error.message });
        });
    } else {
        console.warn(`Sound element not found or not an audio element: ${soundId}`);
    }
}

// Main DOMContentLoaded listener - Simplified
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    gameManager.init(); // Start the game manager initialization

    // --- iOS Audio Unlock (Calls playSound indirectly via element.play()) ---
    let audioUnlocked = false;
    const unlockAudio = async () => {
        if (audioUnlocked) return;
        console.log('Attempting to unlock audio context...');
        const soundsToUnlock = ['correctSound', 'errorSound', 'winSound'];
        // Use Promise.allSettled to try unlocking all sounds
        const unlockPromises = soundsToUnlock.map(soundId => {
            const sound = document.getElementById(soundId);
            if (sound) {
                return sound.play()
                     .then(() => { sound.pause(); sound.currentTime = 0; return soundId; })
                     .catch(error => { return null; });
            } else {
                return Promise.resolve(null);
            }
        });
        const results = await Promise.allSettled(unlockPromises);
        const successfulUnlock = results.some(result => result.status === 'fulfilled' && result.value !== null);
        if (successfulUnlock && !audioUnlocked) {
            console.log('Audio context unlocked successfully!');
            audioUnlocked = true;
            document.body.removeEventListener('click', unlockAudio, true);
            document.body.removeEventListener('touchstart', unlockAudio, true);
        }
    };
    document.body.addEventListener('click', unlockAudio, { once: false, capture: true });
    document.body.addEventListener('touchstart', unlockAudio, { once: false, capture: true });
    // --- End iOS Audio Unlock ---
}); 