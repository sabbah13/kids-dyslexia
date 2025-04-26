// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

// ... existing code ...

// --- Конец Игры 1: Перепутанные Буквы ---

// --- Игра 2: Лови Слоги (Catch Syllables) ---

let catchSyllablesState = {
    currentWordData: null,
    targetSyllables: [],
    caughtSyllables: [],
    nextSyllableIndex: 0,
    fallingSyllables: [], // Массив падающих элементов { element: DOMElement, syllable: string, isCorrect: boolean }
    score: 0,
    errors: 0,
    maxErrors: 5,
    gameInterval: null,
    spawnInterval: 1500, // ms between new syllables
    fallSpeed: 1, // pixels per frame
    isGameOver: false,
    gameAreaHeight: 0,
    gameAreaWidth: 0,
};

function initCatchSyllablesGame() {
    console.log("Initializing Catch Syllables Game...");
    const gameContainer = document.getElementById('game-catch-syllables');
    if (!gameContainer) {
        console.warn("Catch Syllables game container not found in this slide.");
        return; // Exit if the container is not on the current slide
    }

    const gameArea = gameContainer.querySelector('.game-area');
    const scoreDisplay = gameContainer.querySelector('#catch-syllables-score');
    const targetWordArea = gameContainer.querySelector('.target-word-area');
    const fallingArea = gameContainer.querySelector('.falling-syllables-area');
    const feedbackElement = gameContainer.querySelector('.feedback');
    const restartButton = gameContainer.querySelector('#restart-catch-btn');

    if (!gameArea || !scoreDisplay || !targetWordArea || !fallingArea || !feedbackElement || !restartButton) {
        console.error("Catch Syllables: Missing one or more essential game elements in the DOM.");
        return;
    }

    function startCatchGame() {
        console.log("Starting/Restarting Catch Syllables game...");
        catchSyllablesState.isGameOver = false;
        catchSyllablesState.score = 0;
        catchSyllablesState.errors = 0;
        catchSyllablesState.nextSyllableIndex = 0;
        catchSyllablesState.caughtSyllables = [];
        catchSyllablesState.fallingSyllables.forEach(s => s.element.remove()); // Удаляем старые слоги
        catchSyllablesState.fallingSyllables = [];
        targetWordArea.innerHTML = '';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        updateCatchScoreDisplay();

        // Выбор слова
        if (allSyllableData.length === 0) {
            console.error("Нет данных для игры 'Лови Слоги'");
            feedbackElement.textContent = 'Ошибка: нет слов!';
            return;
        }
        const randomIndex = Math.floor(Math.random() * allSyllableData.length);
        catchSyllablesState.currentWordData = allSyllableData[randomIndex];
        catchSyllablesState.targetSyllables = catchSyllablesState.currentWordData.syllables;
        console.log("Selected word:", catchSyllablesState.currentWordData.word);

        // Отображение слотов для слова
        catchSyllablesState.targetSyllables.forEach((syllable, index) => {
            const slot = document.createElement('div');
            slot.classList.add('syllable-slot');
            slot.dataset.index = index;
            targetWordArea.appendChild(slot);
        });

        // Запуск анимации и спауна слогов
        clearInterval(catchSyllablesState.gameInterval); // Очищаем старый интервал
        catchSyllablesState.gameAreaHeight = fallingArea.offsetHeight;
        catchSyllablesState.gameAreaWidth = fallingArea.offsetWidth;
        catchSyllablesState.gameInterval = setInterval(gameLoop, 16); // ~60 FPS

        spawnSyllable(); // Спауним первый слог сразу
        setTimeout(spawnSyllableLoop, catchSyllablesState.spawnInterval); // Начинаем спаунить остальные
    }

    function spawnSyllableLoop() {
        if (catchSyllablesState.isGameOver) return;
        spawnSyllable();
        setTimeout(spawnSyllableLoop, catchSyllablesState.spawnInterval * (0.8 + Math.random() * 0.4)); // Небольшой разброс времени
    }

    function spawnSyllable() {
        if (catchSyllablesState.isGameOver || !fallingArea) return;
        console.log("Spawning syllable...");

        const isCorrectSyllable = Math.random() > 0.4 && catchSyllablesState.nextSyllableIndex < catchSyllablesState.targetSyllables.length; // 60% шанс правильного
        let syllableText = '';

        if (isCorrectSyllable) {
            syllableText = catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex];
        } else {
            // Генерируем неправильный слог (из другого слова или просто набор букв)
            const randomWordIndex = Math.floor(Math.random() * allSyllableData.length);
            const randomSyllableIndex = Math.floor(Math.random() * allSyllableData[randomWordIndex].syllables.length);
            syllableText = allSyllableData[randomWordIndex].syllables[randomSyllableIndex];
            // Проверка, чтобы случайно не совпал с нужным
            if (syllableText === catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]) {
                 syllableText = syllableText + "!"; // Или другая модификация
            }
        }

        const syllableElement = document.createElement('div');
        syllableElement.classList.add('falling-syllable');
        syllableElement.textContent = syllableText;
        syllableElement.dataset.syllable = syllableText;
        syllableElement.dataset.isCorrect = isCorrectSyllable;

        // Случайная позиция X
        const maxLeft = catchSyllablesState.gameAreaWidth - 80; // Учитываем ширину слога
        syllableElement.style.left = Math.random() * maxLeft + 'px';
        syllableElement.style.top = '-50px'; // Начальная позиция над экраном

        syllableElement.addEventListener('click', handleSyllableClick);

        fallingArea.appendChild(syllableElement);
        catchSyllablesState.fallingSyllables.push({ element: syllableElement, syllable: syllableText, isCorrect: isCorrectSyllable });
        console.log(`Spawned: ${syllableText}, Correct: ${isCorrectSyllable}`);
    }

    function handleSyllableClick(event) {
        if (catchSyllablesState.isGameOver) return;
        const clickedElement = event.target;
        const syllable = clickedElement.dataset.syllable;
        const isCorrect = clickedElement.dataset.isCorrect === 'true';

        console.log(`Clicked: ${syllable}, Correct needed: ${catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]}`);

        if (isCorrect && syllable === catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]) {
            // Правильно!
            console.log("Correct syllable caught!");
            playSound('correctSound');
            feedbackElement.textContent = '👍 Поймал!';
            feedbackElement.className = 'feedback success';

            // Помещаем слог в нужный слот
            const targetSlot = targetWordArea.querySelector(`.syllable-slot[data-index="${catchSyllablesState.nextSyllableIndex}"]`);
            if (targetSlot) {
                targetSlot.textContent = syllable;
                targetSlot.classList.add('filled');
            }

            catchSyllablesState.caughtSyllables.push(syllable);
            catchSyllablesState.nextSyllableIndex++;
            catchSyllablesState.score += 10;
            updateCatchScoreDisplay();

            // Удаляем элемент
            clickedElement.remove();
            catchSyllablesState.fallingSyllables = catchSyllablesState.fallingSyllables.filter(s => s.element !== clickedElement);

            checkCatchCompletion();
        } else {
            // Неправильно!
            console.log("Incorrect syllable caught or wrong sequence.");
            playSound('errorSound');
            feedbackElement.textContent = '🤔 Ой, не тот слог!';
            feedbackElement.className = 'feedback error';
            catchSyllablesState.errors++;
            updateCatchScoreDisplay(); // Можно показывать ошибки

            // Анимация ошибки на слоге (например, покраснение)
            clickedElement.style.backgroundColor = '#ff7f7f';
            setTimeout(() => { // Возвращаем цвет, если слог не удаляется
                 // Добавляем проверку, что элемент еще в DOM и что это был НЕПРАВИЛЬНЫЙ клик
                 if (clickedElement.parentElement && !isCorrect) {
                     clickedElement.style.backgroundColor = ''; // Возвращаем исходный для неправильных
                 }
            }, 500);

             if (catchSyllablesState.errors >= catchSyllablesState.maxErrors) {
                 gameOver(false);
             }
        }
    }

    function gameLoop() {
        if (catchSyllablesState.isGameOver) {
            clearInterval(catchSyllablesState.gameInterval);
            return;
        }

        catchSyllablesState.fallingSyllables.forEach((item, index) => {
            const element = item.element;
            let currentTop = parseFloat(element.style.top) || 0;
            currentTop += catchSyllablesState.fallSpeed;
            element.style.top = currentTop + 'px';

            // Удаляем слог, если он упал ниже экрана
            if (currentTop > catchSyllablesState.gameAreaHeight) {
                console.log(`Syllable ${item.syllable} removed (fell off screen)`);
                element.remove();
                catchSyllablesState.fallingSyllables.splice(index, 1);
            }
        });
    }

    function checkCatchCompletion() {
        if (catchSyllablesState.nextSyllableIndex === catchSyllablesState.targetSyllables.length) {
             console.log("Word completed!");
             gameOver(true);
        }
    }

    function gameOver(isWin) {
        console.log(`Game Over. Win: ${isWin}`);
        catchSyllablesState.isGameOver = true;
        clearInterval(catchSyllablesState.gameInterval);

        // Удаляем оставшиеся слоги
        catchSyllablesState.fallingSyllables.forEach(s => s.element.remove());
        catchSyllablesState.fallingSyllables = [];

        if (isWin) {
            feedbackElement.textContent = '🎉 Ура! Слово собрано! 🎉';
            feedbackElement.className = 'feedback success win';
            playSound('winSound');
            catchSyllablesState.score += 50; // Бонус за сбор слова
            updateCatchScoreDisplay();
            if(gameArea) createFireworks(gameArea);
            // Можно добавить setTimeout для старта новой игры
            setTimeout(startCatchGame, 3000);
        } else {
            feedbackElement.textContent = `😟 Ошибок слишком много. Слово было: ${catchSyllablesState.currentWordData.word}`;            
            feedbackElement.className = 'feedback error';
            // Показываем правильное слово в слотах?
            targetWordArea.querySelectorAll('.syllable-slot').forEach((slot, index) => {
                if (!slot.classList.contains('filled')) {
                    slot.textContent = catchSyllablesState.targetSyllables[index];
                    slot.style.color = 'gray'; // Помечаем как не пойманные
                }
            });
        }
    }

     function updateCatchScoreDisplay() {
         if (scoreDisplay) {
             scoreDisplay.textContent = `${catchSyllablesState.score} (Ошибки: ${catchSyllablesState.errors}/${catchSyllablesState.maxErrors})`;
         }
     }

    // Первоначальный запуск игры при инициализации
    startCatchGame();
    // Привязка кнопки рестарта
    restartButton.addEventListener('click', startCatchGame);
}

// --- Здесь будут функции для других игр ---
// function initCatchSyllablesGame() { ... }

// --- End of Game Logic ---