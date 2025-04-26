// js/main.js

// Инициализация Reveal.js после загрузки DOM
document.addEventListener('DOMContentLoaded', async (event) => {
    console.log("DOM fully loaded and parsed");

    // Initialize Reveal.js first
    try {
        Reveal.initialize({
            hash: true, // Добавляем хэши к слайдам в URL
            history: false, // Включаем историю браузера для навигации по слайдам
            controls: true, // Показываем кнопки управления
            progress: true, // Показываем индикатор прогресса
            center: false, // Центрируем слайды вертикально
            transition: 'slide', // Эффект перехода по умолчанию
            touch: false, // <-- Disable touch/swipe navigation
            // Дополнительные настройки, если нужны:
            // width: "100%",
            // height: "100%",
            // margin: 0,
            // minScale: 1,
            // maxScale: 1,

            // Подключение плагинов (если будем использовать)
            // plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
        });
        console.log("Reveal.js initialized successfully.");
    } catch (e) {
        console.error("Error initializing Reveal.js:", e);
    }

    // Initialize games after Reveal.js is set up
    // Check if initGames function exists (loaded from games.js)
    if (typeof initGames === 'function') {
        console.log("Calling initGames() from main.js...");
        await initGames(); // Wait for games (and data) to initialize
        console.log("initGames() finished.");
    } else {
        console.error("initGames function not found! Check games.js loading.");
    }

    console.log("Main script finished (Reveal initialized).");

    // --- iOS Audio Unlock --- 
    let audioUnlocked = false;
    const unlockAudio = async () => {
        if (audioUnlocked) return;
        console.log('Attempting to unlock audio context...');
        // Try to play one of the sounds silently
        const soundsToUnlock = ['correctSound', 'errorSound', 'winSound'];
        let unlocked = false;

        // Use Promise.allSettled to try unlocking all sounds
        const unlockPromises = soundsToUnlock.map(soundId => {
            const sound = document.getElementById(soundId);
            if (sound) {
                return sound.play()
                     .then(() => {
                          // Playback started successfully, pause immediately
                          sound.pause();
                          sound.currentTime = 0;
                          return soundId; // Return ID on success
                      })
                     .catch(error => {
                         // console.warn(`Could not unlock audio with ${soundId}:`, error.name); // Mute warning
                         return null; // Return null on failure
                     });
            } else {
                return Promise.resolve(null); // Resolve null if element not found
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

    // Add listeners for the first user interaction
    document.body.addEventListener('click', unlockAudio, { once: false, capture: true });
    document.body.addEventListener('touchstart', unlockAudio, { once: false, capture: true });
    // --- End iOS Audio Unlock ---

}); 