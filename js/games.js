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
let currentInteractableLetter = null; // To store the interactable instance
let currentDropzoneInteractable = null; // To store the dropzone interactable instance

// --- Initialization Function ---
function initGames() {
    console.log("Инициализация игр из games.js...");
    initScrambledLettersGame();
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
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: {
                start(event) {
                    const target = event.target;
                    target.classList.add('dragging');
                    // Сохраняем начальные координаты для возможного возврата
                    target.setAttribute('data-start-x', target.getBoundingClientRect().left);
                    target.setAttribute('data-start-y', target.getBoundingClientRect().top);
                },
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    const target = event.target;
                    target.classList.remove('dragging');
                    // Если буква не попала в dropzone (проверяем по флагу)
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
         accept: '#game-scrambled-letters .draggable-letters .letter', // Принимаем только буквы из нужного контейнера
         overlap: 0.5, // Требуем 50% перекрытия для срабатывания
         listeners: {
             dragenter(event) {
                 const dropzoneElement = event.target;
                 const draggableElement = event.relatedTarget;
                 if (!dropzoneElement.hasChildNodes()) { // Подсвечиваем только пустые
                      dropzoneElement.classList.add('over');
                      draggableElement.classList.add('can-drop');
                 }
             },
             dragleave(event) {
                 event.target.classList.remove('over');
                 event.relatedTarget.classList.remove('can-drop');
             },
             drop(event) {
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
            default: minLength = 8; maxLength = Math.max(...scrambledLettersData.map(w => w.word.length)); break;
        }
        console.log(`Score: ${score} (Level: ${scoreLevel}), Difficulty Range: ${minLength}-${maxLength} letters`);
        return { minLength, maxLength };
    }

    function setupNewWord() {
        console.log("Setting up new word...");
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';

        const { minLength, maxLength } = determineWordLengthRange();
        let availableWords = scrambledLettersData.filter(item =>
            item.word.length >= minLength &&
            item.word.length <= maxLength &&
            !usedWordsThisSession.includes(item.word)
        );
        if (availableWords.length === 0) {
            console.log("No unused words found for current difficulty, trying any unused words...");
            availableWords = scrambledLettersData.filter(item => !usedWordsThisSession.includes(item.word));
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
        console.log("Selected word:", currentScrambledWord, `(Length: ${currentScrambledWord.length})`, `Used: ${usedWordsThisSession.length}/${scrambledLettersData.length}`);

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