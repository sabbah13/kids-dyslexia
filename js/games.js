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

function initCatchSyllablesGame(wordsData) {
    console.log("Initializing Catch Syllables Game with wordsData:", wordsData);
    const gameContainer = document.getElementById('game-catch-syllables');
    if (!gameContainer) {
        console.warn("Catch Syllables game container not found in this slide.");
        return;
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

    if (!wordsData || wordsData.length === 0) {
        console.error("Word data was not provided to initCatchSyllablesGame.");
        feedbackElement.textContent = 'Ошибка: Данные слов не загружены!';
        return;
    }
    const availableWordsData = wordsData;

    if (catchSyllablesState.gameInterval) {
        clearInterval(catchSyllablesState.gameInterval);
        catchSyllablesState.gameInterval = null;
    }
    catchSyllablesState.fallingSyllables.forEach(s => s.element.remove());
    catchSyllablesState.fallingSyllables = [];

    function updateCatchScoreDisplay() {
         if (scoreDisplay) {
             scoreDisplay.textContent = `${catchSyllablesState.score} (Ошибки: ${catchSyllablesState.errors}/${catchSyllablesState.maxErrors})`;
         }
    }
    
    function gameOver(isWin) {
        console.log(`Game Over. Win: ${isWin}`);
        catchSyllablesState.isGameOver = true;
        clearInterval(catchSyllablesState.gameInterval);

        catchSyllablesState.fallingSyllables.forEach(s => s.element.remove());
        catchSyllablesState.fallingSyllables = [];

        if (isWin) {
            feedbackElement.textContent = '🎉 Ура! Слово собрано! 🎉';
            feedbackElement.className = 'feedback success win';
            playSound('winSound');
            catchSyllablesState.score += 50;
            updateCatchScoreDisplay();
            if(gameArea) createFireworks(gameArea);

            if (catchSyllablesState.currentWordData && catchSyllablesState.currentWordData.emoji && targetWordArea) {
                const emojiElement = document.createElement('div');
                emojiElement.textContent = catchSyllablesState.currentWordData.emoji;
                emojiElement.classList.add('winning-emoji');
                
                const targetRect = targetWordArea.getBoundingClientRect();
                const gameAreaRect = gameArea.getBoundingClientRect();
                emojiElement.style.left = `${targetRect.left - gameAreaRect.left + targetRect.width / 2 - 40}px`;
                emojiElement.style.top = `${targetRect.top - gameAreaRect.top - 80}px`;

                gameArea.appendChild(emojiElement);

                setTimeout(() => {
                    if (emojiElement.parentElement) {
                        emojiElement.remove();
                    }
                }, 3000);
            }

            setTimeout(startCatchGame, 3000);
        } else {
            feedbackElement.textContent = `😟 Ошибок слишком много. Слово было: ${catchSyllablesState.currentWordData.word}`;            
            feedbackElement.className = 'feedback error';
            targetWordArea.querySelectorAll('.syllable-slot').forEach((slot, index) => {
                if (!slot.classList.contains('filled')) {
                    slot.textContent = catchSyllablesState.targetSyllables[index];
                    slot.style.color = 'gray';
                }
            });
        }
    }

    function checkCatchCompletion() {
        if (catchSyllablesState.nextSyllableIndex === catchSyllablesState.targetSyllables.length) {
             console.log("Word completed!");
             gameOver(true);
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

            if (currentTop > catchSyllablesState.gameAreaHeight) {
                console.log(`Syllable ${item.syllable} removed (fell off screen)`);
                element.remove();
                catchSyllablesState.fallingSyllables.splice(index, 1);
            }
        });
    }

    function handleSyllableClick(event) {
        if (catchSyllablesState.isGameOver) return;
        const clickedElement = event.target;
        const syllable = clickedElement.dataset.syllable;
        const isCorrect = clickedElement.dataset.isCorrect === 'true';

        console.log(`Clicked: ${syllable}, Correct needed: ${catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]}`);

        if (isCorrect && syllable === catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]) {
            console.log("Correct syllable caught!");
            playSound('correctSound');
            const targetSlot = targetWordArea.querySelector(`.syllable-slot[data-index="${catchSyllablesState.nextSyllableIndex}"]`);
            if (targetSlot) {
                targetSlot.textContent = syllable;
                targetSlot.classList.add('filled');
                triggerAnimation(targetSlot, 'animate-pulse');
            }

            catchSyllablesState.caughtSyllables.push(syllable);
            catchSyllablesState.nextSyllableIndex++;
            catchSyllablesState.score += 10;
            updateCatchScoreDisplay();

            clickedElement.remove();
            catchSyllablesState.fallingSyllables = catchSyllablesState.fallingSyllables.filter(s => s.element !== clickedElement);

            checkCatchCompletion();
        } else {
            console.log("Incorrect syllable caught or wrong sequence.");
            playSound('errorSound');
            triggerAnimation(clickedElement, 'animate-shake');
            catchSyllablesState.errors++;
            updateCatchScoreDisplay();

            if (catchSyllablesState.errors >= catchSyllablesState.maxErrors) {
                 gameOver(false);
             }
        }
    }

    function spawnSyllable() {
        if (catchSyllablesState.isGameOver || !fallingArea || !availableWordsData || availableWordsData.length === 0) return;
        console.log("Spawning syllable...");

        const isCorrectSyllable = Math.random() > 0.4 && catchSyllablesState.nextSyllableIndex < catchSyllablesState.targetSyllables.length;
        let syllableText = '';

        if (isCorrectSyllable) {
            syllableText = catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex];
        } else {
            const randomWordIndex = Math.floor(Math.random() * availableWordsData.length);
            if (availableWordsData[randomWordIndex] && availableWordsData[randomWordIndex].syllables && availableWordsData[randomWordIndex].syllables.length > 0) {
                const randomSyllableIndex = Math.floor(Math.random() * availableWordsData[randomWordIndex].syllables.length);
                syllableText = availableWordsData[randomWordIndex].syllables[randomSyllableIndex];
                if (catchSyllablesState.targetSyllables.length > catchSyllablesState.nextSyllableIndex && 
                    syllableText === catchSyllablesState.targetSyllables[catchSyllablesState.nextSyllableIndex]) {
                     syllableText = syllableText + "-";
                }
            } else {
                syllableText = "БУМ"; 
            }
        }

        if (!syllableText) {
            console.warn("spawnSyllable: syllableText is empty, skipping spawn.");
            return; 
        }

        const syllableElement = document.createElement('div');
        syllableElement.classList.add('falling-syllable');
        syllableElement.textContent = syllableText;
        syllableElement.dataset.syllable = syllableText;
        syllableElement.dataset.isCorrect = isCorrectSyllable;

        const maxLeft = catchSyllablesState.gameAreaWidth - 80;
        syllableElement.style.left = Math.random() * maxLeft + 'px';
        syllableElement.style.top = '-50px';

        syllableElement.addEventListener('click', handleSyllableClick);

        fallingArea.appendChild(syllableElement);
        catchSyllablesState.fallingSyllables.push({ element: syllableElement, syllable: syllableText, isCorrect: isCorrectSyllable });
        console.log(`Spawned: ${syllableText}, Correct: ${isCorrectSyllable}`);
    }

    function spawnSyllableLoop() {
        if (catchSyllablesState.isGameOver) return;
        spawnSyllable();
        setTimeout(spawnSyllableLoop, catchSyllablesState.spawnInterval * (0.8 + Math.random() * 0.4));
    }

    function startCatchGame() {
        console.log("Starting/Restarting Catch Syllables game...");
        catchSyllablesState.isGameOver = false;
        catchSyllablesState.score = 0;
        catchSyllablesState.errors = 0;
        catchSyllablesState.nextSyllableIndex = 0;
        catchSyllablesState.caughtSyllables = [];
        catchSyllablesState.fallingSyllables.forEach(s => s.element.remove());
        catchSyllablesState.fallingSyllables = [];
        targetWordArea.innerHTML = '';
        fallingArea.innerHTML = '';
        catchSyllablesState.fallingSyllables = [];
        if(feedbackElement) {
            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback';
        }
        updateCatchScoreDisplay();

        if (availableWordsData.length === 0) {
            console.error("Нет данных для игры 'Лови Слоги'");
            if(feedbackElement) feedbackElement.textContent = 'Ошибка: нет слов!';
            return;
        }
        const randomIndex = Math.floor(Math.random() * availableWordsData.length);
        catchSyllablesState.currentWordData = availableWordsData[randomIndex];
        
        if (!catchSyllablesState.currentWordData || !catchSyllablesState.currentWordData.syllables) {
            console.error("Selected word data is invalid or missing syllables:", catchSyllablesState.currentWordData);
            if(feedbackElement) feedbackElement.textContent = 'Ошибка: неверные данные слова!';
            startCatchGame();
            return;
        }
        
        catchSyllablesState.targetSyllables = catchSyllablesState.currentWordData.syllables;
        console.log("Selected word:", catchSyllablesState.currentWordData.word, 
                    "Syllables:", catchSyllablesState.targetSyllables, 
                    "Emoji:", catchSyllablesState.currentWordData.emoji);

        catchSyllablesState.targetSyllables.forEach((syllable, index) => {
            const slot = document.createElement('div');
            slot.classList.add('syllable-slot');
            slot.dataset.index = index;
            targetWordArea.appendChild(slot);
        });

        catchSyllablesState.gameAreaHeight = fallingArea.offsetHeight;
        catchSyllablesState.gameAreaWidth = fallingArea.offsetWidth;
        catchSyllablesState.gameInterval = setInterval(gameLoop, 16);
        spawnSyllable();
        setTimeout(spawnSyllableLoop, catchSyllablesState.spawnInterval);
    }

    startCatchGame();
    restartButton.removeEventListener('click', startCatchGame);
    restartButton.addEventListener('click', startCatchGame);
}

// --- Здесь будут функции для других игр ---
// function initCatchSyllablesGame() { ... }

// --- End of Game Logic ---