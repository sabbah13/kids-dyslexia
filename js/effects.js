// js/effects.js

// Функции для создания визуальных эффектов (конфетти, фейерверк)

function createConfetti(container) {
    const confettiCount = 100;
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.setProperty('--color', randomColor);
        confetti.style.left = Math.random() * 100 + 'vw'; // Случайная позиция по ширине
        confetti.style.animationDelay = Math.random() * 2 + 's'; // Случайная задержка
        confetti.style.width = (Math.random() * 8 + 5) + 'px'; // Случайный размер
        confetti.style.height = confetti.style.width;
        confetti.style.opacity = 0;
        confetti.style.position = 'fixed'; // Фиксированное позиционирование для всей страницы
        confetti.style.top = '-10vh'; // Начальная позиция над экраном
        confetti.style.zIndex = 9999; // Поверх всего

        container.appendChild(confetti);

        // Удаляем конфетти после анимации
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

function createFireworks(container, count = 1, x = 0.5, y = 0.5) {
    const particleCount = 30;
    const colors = ['#ff4e4e', '#ffc700', '#6bff6b', '#54aaff', '#c678ff'];

    for (let i = 0; i < count; i++) {
        const containerRect = container.getBoundingClientRect();
        // Координаты центра контейнера по умолчанию, или переданные x, y в % от ширины/высоты
        const startX = containerRect.left + containerRect.width * x;
        const startY = containerRect.top + containerRect.height * y;

        for (let j = 0; j < particleCount; j++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--color', randomColor);
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.position = 'fixed'; // Используем fixed для позиционирования относительно окна
             particle.style.zIndex = 9998;

            // Случайное направление и расстояние разлета
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50; // от 50 до 200px
            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;

            particle.style.setProperty('--transform', `translate(${translateX}px, ${translateY}px)`);

            document.body.appendChild(particle); // Добавляем частицы прямо в body

            // Удаляем частицу после анимации
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }
}

/**
 * Triggers a CSS animation on an element by adding a class and removing it after a delay.
 * @param {HTMLElement} element - The DOM element to animate.
 * @param {string} animationClass - The CSS class containing the animation definition.
 * @param {number} [duration=1000] - Duration in milliseconds after which to remove the class.
 */
function triggerAnimation(element, animationClass, duration = 1000) {
    if (!element || !animationClass) return;

    // Remove the class if it's already present (to allow re-triggering)
    element.classList.remove(animationClass);

    // Force reflow/repaint to ensure the class removal is processed before adding it again
    // This is sometimes necessary for restarting CSS animations.
    void element.offsetWidth;

    // Add the class to start the animation
    element.classList.add(animationClass);

    // Remove the class after the specified duration
    setTimeout(() => {
        // Check if the element still exists in the DOM
        if (element.parentElement) { 
            element.classList.remove(animationClass);
        }
    }, duration);
}

// PlaySound function - REMOVED from here, should be in main.js or utils.js
// function playSound(soundId) { ... } 