// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

let allWordsData = []; // Будет загружен из JSON
let currentInteractableLetter = null; // To store the interactable instance
let currentDropzoneInteractable = null; // To store the dropzone interactable instance
let allSyllableData = []; // Placeholder for syllable data

let currentScrambledWord = '';
let shuffledLetters = [];
let draggedLetterElement = null;
let score = 0;
let scoreDisplayElement = null;
let restartIconButtonElement = null; // Новая кнопка-иконка рестарта
let usedWordsThisSession = []; // Массив для отслеживания использованных слов

// --- Function to fetch word data ---
async function loadWordData() {
    try {
        const response = await fetch('assets/data/words.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allWordsData = await response.json();
        console.log("Word data loaded successfully:", allWordsData.length, "words");
        return true;
    } catch (error) {
        console.error("Could not load word data:", error);
        // Optionally display an error to the user in the feedback area
        const feedbackElement = document.querySelector('#game-scrambled-letters .feedback');
        if (feedbackElement) {
            feedbackElement.textContent = 'Ошибка загрузки слов!';
            feedbackElement.className = 'feedback error';
        }
        return false;
    }
}

// --- Placeholder Function to fetch syllable data (Update for Task 6) ---
async function loadSyllableData() {
    console.warn("loadSyllableData() not implemented yet. Using placeholder data.");
    // TODO: Fetch from a JSON file like assets/data/syllables.json (Task 6)
    allSyllableData = [
        { word: "КОРОВА", syllables: ["КО", "РО", "ВА"] },
        { word: "СОБАКА", syllables: ["СО", "БА", "КА"] },
        { word: "МАШИНА", syllables: ["МА", "ШИ", "НА"] },
        { word: "РАДУГА", syllables: ["РА", "ДУ", "ГА"] },
        // Add more example words
    ];
    console.log("Placeholder syllable data loaded:", allSyllableData.length, "words");
    return true;
}

// --- Initialization Function ---
async function initGames() { // Make initGames async
    console.log("Инициализация игр из games.js...");
    // Load data first
    const wordDataLoaded = await loadWordData();
    const syllableDataLoaded = await loadSyllableData(); // Load syllable data

    if (wordDataLoaded) { // Init game 1 if its data loaded
        initScrambledLettersGame();
    }
    if (syllableDataLoaded) { // Init game 2 if its data loaded
        initCatchSyllablesGame();
    }
    // Add initialization for other games here later as needed
}

// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

function initScrambledLettersGame() {
    console.log("Initializing Scrambled Letters Game with interact.js...");
    const gameContainer = document.getElementById('game-scrambled-letters');
    if (!gameContainer) return;

    scoreDisplayElement = document.getElementById('scrambled-score');
    restartIconButtonElement = document.getElementById('restart-icon-btn');
    const placeholdersContainer = gameContainer.querySelector('.letter-placeholders');
    const lettersContainer = gameContainer.querySelector('.draggable-letters');
    const feedbackElement = gameContainer.querySelector('.feedback');
    const imageContainer = gameContainer.querySelector('.word-image p');

    if (!interact) { // Check if interact.js is loaded
        console.error("interact.js не загружен!");
        feedbackElement.textContent = "Ошибка загрузки D&D! Обновите страницу.";
        return;
    }

    if (!placeholdersContainer || !lettersContainer || !feedbackElement || !imageContainer || !scoreDisplayElement || !restartIconButtonElement) {
        console.error("Не найдены все необходимые элементы в DOM для игры 'Перепутанные Буквы'.");
        return;
    }

    // Уничтожаем предыдущие интеракции, если они были (важно при рестарте)
    if (currentInteractableLetter) currentInteractableLetter.unset();
    if (currentDropzoneInteractable) currentDropzoneInteractable.unset();

    startGame();
    restartIconButtonElement.addEventListener('click', startGame);

    // --- Настройка Draggable букв с interact.js --- 
    currentInteractableLetter = interact('#game-scrambled-letters .draggable-letters .letter')
        .draggable({
            // inertia: true, // Temporarily disable inertia
            // modifiers: [ // Temporarily disable modifiers
            //     interact.modifiers.restrictRect({
            //         restriction: 'parent',
            //         endOnly: true
            //     })
            // ],
            autoScroll: true,
            listeners: {
                start(event) {
                    console.log("Interact.js DRAG START fired for:", event.target.textContent);
                    const target = event.target;
                    target.classList.add('dragging');
                    target.setAttribute('data-start-x', target.getBoundingClientRect().left);
                    target.setAttribute('data-start-y', target.getBoundingClientRect().top);
                },
                move(event) {
                    // console.log("Interact.js DRAG MOVE fired"); // Can be very noisy
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    console.log("Interact.js DRAG END fired for:", event.target.textContent);
                    const target = event.target;
                    target.classList.remove('dragging');
                    if (!event.relatedTarget || !target.classList.contains('placed-in-dropzone')) {
                         // Плавно возвращаем на исходную позицию или просто сбрасываем transform
                         target.style.transform = 'translate(0px, 0px)';
                         target.setAttribute('data-x', 0);
                         target.setAttribute('data-y', 0);
                         console.log('Letter returned to start', target.textContent);
                    }
                     target.classList.remove('placed-in-dropzone'); // Убираем временный флаг
                }
            }
        });

    // --- Настройка Dropzone плейсхолдеров с interact.js --- 
     currentDropzoneInteractable = interact('#game-scrambled-letters .placeholder').dropzone({
         accept: '#game-scrambled-letters .draggable-letters .letter',
         overlap: 0.5,
         listeners: {
             dragenter(event) {
                 console.log("Interact.js DRAG ENTER fired on placeholder:", event.target.dataset.index, "by:", event.relatedTarget.textContent);
                 const dropzoneElement = event.target;
                 const draggableElement = event.relatedTarget;
                 if (!dropzoneElement.hasChildNodes()) { // Подсвечиваем только пустые
                      dropzoneElement.classList.add('over');
                      draggableElement.classList.add('can-drop');
                 }
             },
             dragleave(event) {
                 console.log("Interact.js DRAG LEAVE fired on placeholder:", event.target.dataset.index, "by:", event.relatedTarget.textContent);
                 event.target.classList.remove('over');
                 event.relatedTarget.classList.remove('can-drop');
             },
             drop(event) {
                 console.log("Interact.js DROP fired on placeholder:", event.target.dataset.index, "with:", event.relatedTarget.textContent);
                 const dropzoneElement = event.target;
                 const draggableElement = event.relatedTarget;

                 dropzoneElement.classList.remove('over');
                 draggableElement.classList.remove('can-drop');

                 if (dropzoneElement.hasChildNodes()) {
                    console.log('Drop ignored: Placeholder occupied.');
                    // interact.js сам вернет элемент, если drop не удался
                    return;
                 }

                 const letter = draggableElement.dataset.letter;
                 const targetIndex = parseInt(dropzoneElement.dataset.index);
                 console.log(`Drop event: Letter '${letter}' dropped on placeholder index ${targetIndex}`);

                if (currentScrambledWord[targetIndex] === letter) {
                    // Правильно!
                    dropzoneElement.appendChild(draggableElement);
                    // Сбрасываем transform и data-x/y
                    draggableElement.style.transform = 'translate(0px, 0px)';
                    draggableElement.setAttribute('data-x', 0);
                    draggableElement.setAttribute('data-y', 0);
                    draggableElement.classList.add('placed');
                    draggableElement.classList.add('placed-in-dropzone'); // Флаг, что буква успешно помещена

                    // Отключаем возможность перетаскивания этой буквы
                    // interact(draggableElement).unset(); // Не стоит отключать, просто стилизуем
                    interact(draggableElement).draggable(false);

                    feedbackElement.textContent = '👍 Отлично!';
                    feedbackElement.className = 'feedback success';
                    playSound('correctSound');
                    checkWordCompletion();
                } else {
                    // Неправильно!
                    feedbackElement.textContent = '🤔 Попробуй другую букву!';
                    feedbackElement.className = 'feedback error';
                    playSound('errorSound');
                    // interact.js вернет букву на место сам (через событие dragend)
                }
             }
         }
     });

    function determineWordLengthRange() {
        let minLength, maxLength;
        const scoreLevel = Math.floor(score / 5); // Уровень определяется каждые 5 очков

        switch (scoreLevel) {
            case 0: minLength = 3; maxLength = 4; break;
            case 1: minLength = 4; maxLength = 5; break;
            case 2: minLength = 5; maxLength = 6; break;
            case 3: minLength = 6; maxLength = 7; break;
            case 4: minLength = 7; maxLength = 8; break;
            default: minLength = 8; maxLength = Math.max(...allWordsData.map(w => w.word.length)); break;
        }
        console.log(`Score: ${score} (Level: ${scoreLevel}), Difficulty Range: ${minLength}-${maxLength} letters`);
        return { minLength, maxLength };
    }

    function setupNewWord() {
        console.log("Setting up new word...");
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';

        const { minLength, maxLength } = determineWordLengthRange();
        let availableWords = allWordsData.filter(item =>
            item.word.length >= minLength &&
            item.word.length <= maxLength &&
            !usedWordsThisSession.includes(item.word)
        );
        if (availableWords.length === 0) {
            console.log("No unused words found for current difficulty, trying any unused words...");
            availableWords = allWordsData.filter(item => !usedWordsThisSession.includes(item.word));
        }
        if (availableWords.length === 0) {
             feedbackElement.textContent = "🎉 Ура! Ты прошел ВСЕ слова! 🎉";
             feedbackElement.className = 'feedback success';
             if(lettersContainer) lettersContainer.innerHTML = '';
             if(placeholdersContainer) placeholdersContainer.innerHTML = '';
             if(imageContainer) imageContainer.textContent = '🏆';
             console.log("All words completed in this session!");
             return;
        }

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWordData = availableWords[randomIndex];
        currentScrambledWord = selectedWordData.word;
        usedWordsThisSession.push(currentScrambledWord);
        const currentEmoji = selectedWordData.emoji;
        console.log("Selected word:", currentScrambledWord, `(Length: ${currentScrambledWord.length})`, `Used: ${usedWordsThisSession.length}/${allWordsData.length}`);

        shuffledLetters = currentScrambledWord.split('').sort(() => Math.random() - 0.5);
        if (shuffledLetters.join('') === currentScrambledWord && currentScrambledWord.length > 1) {
             shuffledLetters = currentScrambledWord.split('').sort(() => Math.random() - 0.5);
        }

        if(placeholdersContainer) placeholdersContainer.innerHTML = '';
        if(lettersContainer) lettersContainer.innerHTML = '';
        if(imageContainer) imageContainer.textContent = currentEmoji;

        for (let i = 0; i < currentScrambledWord.length; i++) {
            const placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            placeholder.dataset.index = i;
            if(placeholdersContainer) placeholdersContainer.appendChild(placeholder);
        }

        shuffledLetters.forEach((letter, index) => {
            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');
            letterDiv.textContent = letter;
            letterDiv.dataset.letter = letter;
            letterDiv.id = `letter-${index}-${Date.now()}`;
             // Сбрасываем стили и data атрибуты перед добавлением
             letterDiv.style.transform = 'translate(0px, 0px)';
             letterDiv.setAttribute('data-x', 0);
             letterDiv.setAttribute('data-y', 0);
             letterDiv.classList.remove('placed', 'placed-in-dropzone');
            if(lettersContainer) lettersContainer.appendChild(letterDiv);
        });

        // Теперь interact.js сам найдет нужные элементы по селекторам
        // Динамически обновлять обработчики не нужно, если селекторы не меняются.
         // Но нужно убедиться, что для новых букв включен draggable
         if(currentInteractableLetter) {
            // interact('.letter').draggable(true); // Включаем для всех .letter
             // Обновляем? Нет, interact.js должен подхватить новые элементы по селектору
         }

        console.log("New word setup complete.");
    }

    // --- Новая функция старта/рестарта --- 
    function startGame() {
        console.log("Starting/Restarting game...");
        score = 0;
        usedWordsThisSession = [];
        updateScoreDisplay();
        currentScrambledWord = '';
        // Важно: Убедимся, что контейнеры существуют перед очисткой
        if(lettersContainer) lettersContainer.innerHTML = '';
        if(placeholdersContainer) placeholdersContainer.innerHTML = '';
        setupNewWord(); // Начинаем с нового слова
    }

    // --- Функция обновления счета на экране ---
    function updateScoreDisplay() {
         if (scoreDisplayElement) {
             scoreDisplayElement.textContent = score;
         }
     }

    function checkWordCompletion() {
        if(!placeholdersContainer) return; // Проверка на всякий случай
        const placeholders = placeholdersContainer.querySelectorAll('.placeholder');
        let allPlacedCorrectly = true;
        if(placeholders.length !== currentScrambledWord.length) {
            allPlacedCorrectly = false; // Если число плейсхолдеров не совпадает
        }
        placeholders.forEach((p, index) => {
            const child = p.querySelector('.letter');
            if (!child || child.dataset.letter !== currentScrambledWord[index]) {
                allPlacedCorrectly = false;
            }
        });

        if (allPlacedCorrectly) {
            console.log("Word completed!");
            score++;
            updateScoreDisplay();
            feedbackElement.textContent = '🎉 Правильно! Слово собрано! 🎉';
            feedbackElement.className = 'feedback success win';
            playSound('winSound');

            const gameArea = gameContainer?.querySelector('.game-area'); // Добавим ?. для безопасности
            if (gameArea) {
                createFireworks(gameArea);
                createConfetti(document.body);
            } else {
                 console.warn("Не удалось найти .game-area для запуска эффектов.");
            }

            console.log("Starting timer for next word...");
            setTimeout(() => {
                console.log("Timer finished, setting up new word.");
                setupNewWord();
            }, 3000); 

             // Делаем плейсхолдеры неактивными для dropzone (буквы уже нельзя перетаскивать)
             if (currentDropzoneInteractable) {
                // interact('#game-scrambled-letters .placeholder').dropzone(false); // Отключаем dropzone временно? Или не нужно?
             }
        }
    }
}
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
                 if (clickedElement.parentElement) { // Проверяем, что элемент еще в DOM
                     clickedElement.style.backgroundColor = ''; // Возвращаем исходный
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