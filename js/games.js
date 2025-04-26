// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

// Определяем итоговый массив слов сразу
const scrambledLettersData = [
    // Короткие (3-4 буквы) - 20+ слов
    { word: "ДОМ", emoji: "🏠" }, { word: "КОТ", emoji: "🐈" }, { word: "СУП", emoji: "🍲" },
    { word: "МЯЧ", emoji: "⚽" }, { word: "ЛЕС", emoji: "🌳" }, { word: "ДУБ", emoji: "🌳" },
    { word: "РЫБА", emoji: "🐠" }, { word: "УТКА", emoji: "🦆" }, { word: "ВОДА", emoji: "💧" },
    { word: "НЕБО", emoji: "☁️" }, { word: "ЛУНА", emoji: "🌙" }, { word: "ХЛЕБ", emoji: "🍞" },
    { word: "СЫР", emoji: "🧀" }, { word: "ПАРК", emoji: "🏞️" }, { word: "СТВОЛ", emoji: "🪵" }, // Используем дерево для ствола
    { word: "СТУЛ", emoji: "🪑" }, { word: "ШАР", emoji: "🎈" }, { word: "ФЛАГ", emoji: "🚩" },
    { word: "КЛЮЧ", emoji: "🔑" }, { word: "МОСТ", emoji: "🌉" }, { word: "ЧАСЫ", emoji: "🕰️" },

    // Средние (5-6 букв) - 25+ слов
    { word: "ЯБЛОКО", emoji: "🍎" }, { word: "СОЛНЦЕ", emoji: "☀️" }, { word: "МАШИНА", emoji: "🚗" },
    { word: "КНИГА", emoji: "📚" }, { word: "РАДУГА", emoji: "🌈" }, { word: "ЗВЕЗДА", emoji: "⭐" },
    { word: "ЦВЕТОК", emoji: "🌸" }, { word: "ШКОЛА", emoji: "🏫" }, { word: "МУЗЫКА", emoji: "🎵" },
    { word: "ПТИЧКА", emoji: "🐦" }, { word: "СОБАКА", emoji: "🐕" }, { word: "КОРОВА", emoji: "🐄" },
    { word: "ЗАЯЦ", emoji: "🐇" }, { word: "СТАКАН", emoji: "🥛" }, { word: "КРЕСЛО", emoji: "🛋️" },
    { word: "ПЛАНЕТА", emoji: "🪐" }, { word: "РАКЕТА", emoji: "🚀" }, { word: "ЗАМОК", emoji: "🏰" },
    { word: "ЗЕБРА", emoji: "🦓" }, { word: "БАНАН", emoji: "🍌" }, { word: "ГРУША", emoji: "🍐" },
    { word: "СЛИВА", emoji: "🍑" }, { word: "ОГОНЬ", emoji: "🔥" }, { word: "РЮКЗАК", emoji: "🎒" },
    { word: "ЛОДКА", emoji: "⛵" }, { word: "ШЛЯПА", emoji: "👒" }, { word: "ТУЧКА", emoji: "🌥️" },

    // Длинные (7-8 букв) - 20+ слов
    { word: "ПОДАРОК", emoji: "🎁" }, { word: "ДЕРЕВО", emoji: "🌳" }, { word: "КАРАНДАШ", emoji: "✏️" },
    { word: "ТЕЛЕФОН", emoji: "📱" }, { word: "ПИРАМИДА", emoji: "🔺" }, { word: "АПЕЛЬСИН", emoji: "🍊" },
    { word: "КАРТОШКА", emoji: "🥔" }, { word: "КАРТИНА", emoji: "🖼️" }, { word: "ПАРОВОЗ", emoji: "🚂" },
    { word: "СКРИПКА", emoji: "🎻" }, { word: "БАБОЧКА", emoji: "🦋" }, { word: "АВТОБУС", emoji: "🚌" },
    { word: "ЛЯГУШКА", emoji: "🐸" }, { word: "МОЛОКО", emoji: "🥛" }, { word: "САПОГИ", emoji: "👢" },
    { word: "КОНФЕТА", emoji: "🍬" }, { word: "ТЕТРАДЬ", emoji: "📓" }, { word: "ПОМИДОР", emoji: "🍅" },
    { word: "АНАНАС", emoji: "🍍" }, { word: "ПОДУШКА", emoji: "<0xF0><0x9F><0xAB><0x95>" },

    // Очень длинные (> 8 букв) - 15+ слов
    { word: "МОРОЖЕНОЕ", emoji: "🍦" }, { word: "ВЕЛОСИПЕД", emoji: "🚲" }, { word: "САМОЛЕТ", emoji: "✈️" },
    { word: "КОРАБЛЬ", emoji: "🚢" }, { word: "КОМПЬЮТЕР", emoji: "💻" }, { word: "ПЛАНШЕТ", emoji: "📲" },
    { word: "ФОТОАППАРАТ", emoji: "📷" }, { word: "ВЕРТОЛЕТ", emoji: "🚁" }, { word: "ТЕЛЕВИЗОР", emoji: "📺" },
    { word: "ХОЛОДИЛЬНИК", emoji: "🧊" }, { word: "КАЛЬКУЛЯТОР", emoji: "🧮" }, { word: "ЧЕРЕПАХА", emoji: "🐢" },
    { word: "АВТОМОБИЛЬ", emoji: "🚗" }, { word: "ЭКСКАВАТОР", emoji: "<0xF0><0x9F><0x9A><0x91>" }, { word: "БИБЛИОТЕКА", emoji: "<0xF0><0x9F><0x93><0x9A>" },
    { word: "ВИНОГРАД", emoji: "🍇" },
];

let currentScrambledWord = '';
let shuffledLetters = [];
let draggedLetterElement = null;
let score = 0;
let scoreDisplayElement = null;
let restartIconButtonElement = null; // Новая кнопка-иконка рестарта
let usedWordsThisSession = []; // Массив для отслеживания использованных слов

// --- Initialization Function ---
function initGames() {
    console.log("Инициализация игр из games.js...");
    initScrambledLettersGame();
}

// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

function initScrambledLettersGame() {
    console.log("Initializing Scrambled Letters Game...");
    const gameContainer = document.getElementById('game-scrambled-letters');
    if (!gameContainer) return;

    scoreDisplayElement = document.getElementById('scrambled-score');
    restartIconButtonElement = document.getElementById('restart-icon-btn'); // Новый селектор по ID

    const placeholdersContainer = gameContainer.querySelector('.letter-placeholders');
    const lettersContainer = gameContainer.querySelector('.draggable-letters');
    const feedbackElement = gameContainer.querySelector('.feedback');
    const imageContainer = gameContainer.querySelector('.word-image p');

    if (!placeholdersContainer || !lettersContainer || !feedbackElement || !imageContainer || !scoreDisplayElement || !restartIconButtonElement) {
        console.error("Не найдены все необходимые элементы в DOM для игры 'Перепутанные Буквы'.");
        return;
    }

    // Инициализируем счет
    score = 0;
    updateScoreDisplay();

    startGame(); // Запускаем стартовую функцию
    restartIconButtonElement.addEventListener('click', startGame); // Назначаем ее же на рестарт

    // Настройка перетаскивания для букв
    function setupDraggableLetters() {
        const letters = lettersContainer.querySelectorAll('.letter');
        letters.forEach(letter => {
            letter.setAttribute('draggable', 'true');
            letter.removeEventListener('dragstart', handleDragStart); // Убираем старый обработчик на всякий случай
            letter.addEventListener('dragstart', handleDragStart);
            letter.removeEventListener('dragend', handleDragEnd);
            letter.addEventListener('dragend', handleDragEnd);
        });
    }

    // Настройка зон для бросания
    function setupDropZones() {
         const placeholders = placeholdersContainer.querySelectorAll('.placeholder');
         placeholders.forEach(placeholder => {
             placeholder.removeEventListener('dragover', handleDragOver);
             placeholder.addEventListener('dragover', handleDragOver);
             placeholder.removeEventListener('dragenter', handleDragEnter);
             placeholder.addEventListener('dragenter', handleDragEnter);
             placeholder.removeEventListener('dragleave', handleDragLeave);
             placeholder.addEventListener('dragleave', handleDragLeave);
             placeholder.removeEventListener('drop', handleDrop);
             placeholder.addEventListener('drop', handleDrop);
         });
    }

    function determineWordLengthRange() {
        let minLength, maxLength;
        const scoreLevel = Math.floor(score / 5); // Уровень определяется каждые 5 очков

        switch (scoreLevel) {
            case 0: // Очки 0-4
                minLength = 3;
                maxLength = 4;
                break;
            case 1: // Очки 5-9
                minLength = 4;
                maxLength = 5;
                break;
            case 2: // Очки 10-14
                minLength = 5;
                maxLength = 6;
                break;
            case 3: // Очки 15-19
                minLength = 6;
                maxLength = 7;
                break;
            case 4: // Очки 20-24
                minLength = 7;
                maxLength = 8;
                break;
            default: // Очки 25+
                minLength = 8;
                maxLength = Math.max(...scrambledLettersData.map(w => w.word.length)); // Берем все до максимальной длины
                break;
        }

        console.log(`Score: ${score} (Level: ${scoreLevel}), Difficulty Range: ${minLength}-${maxLength} letters`);
        return { minLength, maxLength };
    }

    function setupNewWord() {
        console.log("Setting up new word...");
        feedbackElement.textContent = ''; // Очищаем фидбек при начале нового слова
        feedbackElement.className = 'feedback';

        const { minLength, maxLength } = determineWordLengthRange();

        // Фильтруем слова по длине И по НЕиспользованным словам
        let availableWords = scrambledLettersData.filter(item =>
            item.word.length >= minLength &&
            item.word.length <= maxLength &&
            !usedWordsThisSession.includes(item.word) // <--- Новое условие
        );

        // Если на текущем уровне сложности НЕИСПОЛЬЗОВАННЫХ слов не осталось
        if (availableWords.length === 0) {
            console.log("No unused words found for current difficulty, trying any unused words...");
            // Пытаемся найти ЛЮБОЕ неиспользованное слово, даже если длина не подходит
            availableWords = scrambledLettersData.filter(item => !usedWordsThisSession.includes(item.word));
        }

        // Если ВООБЩЕ не осталось неиспользованных слов
        if (availableWords.length === 0) {
             feedbackElement.textContent = "🎉 Ура! Ты прошел ВСЕ слова! 🎉";
             feedbackElement.className = 'feedback success';
             lettersContainer.innerHTML = '';
             placeholdersContainer.innerHTML = '';
             imageContainer.textContent = '🏆';
             console.log("All words completed in this session!");
             // Можно скрыть кнопку рестарта или изменить ее текст
             // restartIconButtonElement.style.display = 'none';
             return;
        }

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWordData = availableWords[randomIndex];
        currentScrambledWord = selectedWordData.word;
        usedWordsThisSession.push(currentScrambledWord); // <--- Добавляем слово в использованные
        const currentEmoji = selectedWordData.emoji;
        console.log("Selected word:", currentScrambledWord, `(Length: ${currentScrambledWord.length})`, `Used: ${usedWordsThisSession.length}/${scrambledLettersData.length}`);

        shuffledLetters = currentScrambledWord.split('').sort(() => Math.random() - 0.5);
        if (shuffledLetters.join('') === currentScrambledWord && currentScrambledWord.length > 1) {
             shuffledLetters = currentScrambledWord.split('').sort(() => Math.random() - 0.5);
        }

        placeholdersContainer.innerHTML = '';
        lettersContainer.innerHTML = '';
        // imageContainer.textContent = currentEmoji; // Обновляем эмодзи
        if(imageContainer) imageContainer.textContent = currentEmoji;

        for (let i = 0; i < currentScrambledWord.length; i++) {
            const placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            placeholder.dataset.index = i;
            placeholdersContainer.appendChild(placeholder);
        }

        shuffledLetters.forEach((letter, index) => {
            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');
            letterDiv.textContent = letter;
            letterDiv.dataset.letter = letter;
            letterDiv.id = `letter-${index}-${Date.now()}`;
            // console.log('Appending letter:', letterDiv);
            lettersContainer.appendChild(letterDiv);
        });

        setupDraggableLetters();
        setupDropZones();
        console.log("New word setup complete.");
    }

    // --- Новая функция старта/рестарта --- 
    function startGame() {
        console.log("Starting/Restarting game...");
        score = 0;
        usedWordsThisSession = []; // Очищаем список использованных слов
        updateScoreDisplay();
        currentScrambledWord = ''; // Сбрасываем текущее слово
        setupNewWord(); // Начинаем с нового слова базовой сложности
    }

    // --- Функция обновления счета на экране ---
    function updateScoreDisplay() {
         if (scoreDisplayElement) {
             scoreDisplayElement.textContent = score;
         }
     }

    // --- Обработчики Drag and Drop ---

    function handleDragStart(e) {
        draggedLetterElement = e.target;
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
             if(draggedLetterElement) draggedLetterElement.classList.add('dragging');
        }, 0);
        // console.log('Drag Start:', e.target.textContent);
    }

    function handleDragEnd(e) {
         if (draggedLetterElement) {
             draggedLetterElement.classList.remove('dragging');
         }
         placeholdersContainer.querySelectorAll('.placeholder.over').forEach(p => p.classList.remove('over'));
        draggedLetterElement = null;
        // console.log('Drag End');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

     function handleDragEnter(e) {
         e.preventDefault();
         const placeholder = e.target.closest('.placeholder');
         if (placeholder && !placeholder.hasChildNodes()) {
             placeholder.classList.add('over');
         }
     }

    function handleDragLeave(e) {
         const placeholder = e.target.closest('.placeholder');
         if (placeholder) {
             placeholder.classList.remove('over');
         }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

         const placeholder = e.target.closest('.placeholder');
         if (!placeholder) return;

         placeholder.classList.remove('over');
         const draggedElementId = e.dataTransfer.getData('text/plain');
         const draggedEl = document.getElementById(draggedElementId);

         if (!draggedEl) {
             console.error('Could not find dragged element by ID:', draggedElementId);
             if (!draggedLetterElement) {
                 console.error('draggedLetterElement is also null!');
                 return;
             }
             draggedEl = draggedLetterElement;
         }

         if (placeholder.hasChildNodes()) {
             console.log('Drop ignored: Placeholder occupied.');
             return;
         }

        const letter = draggedEl.dataset.letter;
        const targetIndex = parseInt(placeholder.dataset.index);

        // console.log(`Drop: Letter '${letter}' (ID: ${draggedElementId}) into placeholder index ${targetIndex}`);

        if (currentScrambledWord[targetIndex] === letter) {
            // Правильно!
            draggedEl.setAttribute('draggable', 'false');
            draggedEl.removeEventListener('dragstart', handleDragStart);
            draggedEl.removeEventListener('dragend', handleDragEnd);
            draggedEl.classList.remove('dragging');
            draggedEl.classList.add('placed');
            draggedEl.style.position = 'static';
            draggedEl.style.left = '';
            draggedEl.style.top = '';

            placeholder.appendChild(draggedEl);

            feedbackElement.textContent = '👍 Отлично!';
            feedbackElement.className = 'feedback success';
            playSound('correctSound');

            checkWordCompletion();
        } else {
            // Неправильно!
            feedbackElement.textContent = '🤔 Попробуй другую букву!';
            feedbackElement.className = 'feedback error';
            playSound('errorSound');
        }
        draggedLetterElement = null;
    }

    function checkWordCompletion() {
        const placeholders = placeholdersContainer.querySelectorAll('.placeholder');
        let allPlacedCorrectly = true;
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

            const gameArea = gameContainer.querySelector('.game-area');
            if (gameArea) {
                createFireworks(gameArea);
                createConfetti(document.body);
            } else {
                 console.warn("Не удалось найти .game-area для запуска эффектов.");
            }

            // Автоматический переход к следующему слову через 3 секунды
            console.log("Starting timer for next word...");
            setTimeout(() => {
                console.log("Timer finished, setting up new word.");
                setupNewWord();
            }, 3000); // 3000 миллисекунд = 3 секунды

             placeholders.forEach(p => {
                 p.removeEventListener('dragover', handleDragOver);
                 p.removeEventListener('dragenter', handleDragEnter);
                 p.removeEventListener('dragleave', handleDragLeave);
                 p.removeEventListener('drop', handleDrop);
             });
        }
    }
}
// --- Конец Игры 1: Перепутанные Буквы ---

// --- Здесь будут функции для других игр ---
// function initCatchSyllablesGame() { ... }

// --- Wait for DOM and then initialize all games ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing games from games.js...");
    // Можно добавить проверку, инициализирован ли Reveal.js, но обычно DOMContentLoaded достаточно
    // if (Reveal.isReady()) { ... }
    initGames();
});

// --- End of Game Logic ---