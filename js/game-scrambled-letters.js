// --- Игра 1: Перепутанные Буквы (Scrambled Letters) ---

let currentScrambledWord = '';
let shuffledLetters = [];
let draggedLetterElement = null;
let score = 0;
let scoreDisplayElement = null;
let restartIconButtonElement = null; // Новая кнопка-иконка рестарта
let usedWordsThisSession = []; // Массив для отслеживания использованных слов
let currentInteractableLetter = null; // To store the interactable instance
let currentDropzoneInteractable = null; // To store the dropzone interactable instance

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
                    playSound('correctSound'); // Assuming playSound is global or imported
                    checkWordCompletion();
                } else {
                    // Неправильно!
                    feedbackElement.textContent = '🤔 Попробуй другую букву!';
                    feedbackElement.className = 'feedback error';
                    playSound('errorSound'); // Assuming playSound is global or imported
                    // interact.js вернет букву на место сам (через событие dragend)
                }
             }
         }
     });

    function determineWordLengthRange() {
        let minLength, maxLength;
        const scoreLevel = Math.floor(score / 5); // Уровень определяется каждые 5 очков

        // Ensure allWordsData is available (might need to pass it or make it global)
        if (!window.allWordsData || window.allWordsData.length === 0) {
            console.error("Word data not available for determining length range.");
            return { minLength: 3, maxLength: 4 }; // Default fallback
        }


        switch (scoreLevel) {
            case 0: minLength = 3; maxLength = 4; break;
            case 1: minLength = 4; maxLength = 5; break;
            case 2: minLength = 5; maxLength = 6; break;
            case 3: minLength = 6; maxLength = 7; break;
            case 4: minLength = 7; maxLength = 8; break;
            default: minLength = 8; maxLength = Math.max(...window.allWordsData.map(w => w.word.length)); break;
        }
        console.log(`Score: ${score} (Level: ${scoreLevel}), Difficulty Range: ${minLength}-${maxLength} letters`);
        return { minLength, maxLength };
    }

    function setupNewWord() {
        console.log("Setting up new word...");
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';

        // Ensure allWordsData is available
        if (!window.allWordsData || window.allWordsData.length === 0) {
             console.error("Cannot setup new word: Word data is not loaded.");
             feedbackElement.textContent = 'Ошибка: слова не загружены!';
             feedbackElement.className = 'feedback error';
             return;
        }


        const { minLength, maxLength } = determineWordLengthRange();
        let availableWords = window.allWordsData.filter(item =>
            item.word.length >= minLength &&
            item.word.length <= maxLength &&
            !usedWordsThisSession.includes(item.word)
        );
        if (availableWords.length === 0) {
            console.log("No unused words found for current difficulty, trying any unused words...");
            availableWords = window.allWordsData.filter(item => !usedWordsThisSession.includes(item.word));
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
        console.log("Selected word:", currentScrambledWord, `(Length: ${currentScrambledWord.length})`, `Used: ${usedWordsThisSession.length}/${window.allWordsData.length}`);

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

        // Make sure draggable is enabled for potentially new elements
         if(currentInteractableLetter) {
            // Re-enable draggable on the selector to catch new elements
            interact('#game-scrambled-letters .draggable-letters .letter').draggable(true);
         } else {
             console.warn("currentInteractableLetter not defined, cannot ensure draggable is enabled for new letters.");
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
            playSound('winSound'); // Assuming playSound is global or imported

            const gameArea = gameContainer?.querySelector('.game-area'); // Добавим ?. для безопасности
            if (gameArea) {
                // Assuming createFireworks and createConfetti are global or imported
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
             // if (currentDropzoneInteractable) {
             //    interact('#game-scrambled-letters .placeholder').dropzone(false); // Отключаем dropzone временно? Или не нужно?
             // }
        }
    }
}
// --- Конец Игры 1: Перепутанные Буквы --- 