// js/main.js

// Инициализация Reveal.js после загрузки DOM
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");

    // Initialize Reveal.js first
    try {
        Reveal.initialize({
            hash: true, // Добавляем хэши к слайдам в URL
            history: true, // Включаем историю браузера для навигации по слайдам
            controls: true, // Показываем кнопки управления
            progress: true, // Показываем индикатор прогресса
            center: true, // Центрируем слайды вертикально
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

    // Game initialization is now handled within games.js itself
    // if (typeof initGames === 'function') { ... } // Этот блок больше не нужен здесь

    console.log("Main script finished (Reveal initialized).");

    // --- iOS Audio Unlock --- 
    let audioUnlocked = false;
    const unlockAudio = () => {
        if (audioUnlocked) return;
        console.log('Attempting to unlock audio context...');
        // Try to play one of the sounds silently
        const soundsToUnlock = ['correctSound', 'errorSound', 'winSound'];
        let unlocked = false;
        soundsToUnlock.forEach(soundId => {
            const sound = document.getElementById(soundId);
            if (sound) {
                const playPromise = sound.play();
                if (playPromise !== undefined) {
                     playPromise.then(() => {
                         // Playback started successfully, pause immediately
                         sound.pause();
                         sound.currentTime = 0;
                         if (!unlocked) {
                            console.log('Audio context likely unlocked with:', soundId);
                            unlocked = true;
                            audioUnlocked = true; // Set global flag
                            // Remove the listener after successful unlock
                            document.body.removeEventListener('click', unlockAudio, true);
                            document.body.removeEventListener('touchstart', unlockAudio, true);
                         }
                     }).catch(error => {
                         // Playback failed, likely needs more interaction
                         // console.warn(`Could not unlock audio with ${soundId}:`, error.name, error.message);
                     });
                } 
                // else { // Optional: Handle browsers not supporting play() promise
                //     sound.pause();
                //     sound.currentTime = 0;
                // }
            }
        });
        // Fallback in case promises didn't resolve/unlock immediately
        // audioUnlocked = true;
        // document.body.removeEventListener('click', unlockAudio, true);
        // document.body.removeEventListener('touchstart', unlockAudio, true);
    };

    // Add listeners for the first user interaction
    document.body.addEventListener('click', unlockAudio, { once: false, capture: true });
    document.body.addEventListener('touchstart', unlockAudio, { once: false, capture: true });
    // --- End iOS Audio Unlock ---

}); 