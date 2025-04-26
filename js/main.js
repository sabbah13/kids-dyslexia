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
}); 