let allWordsData = []; // Глобальная переменная для слов
let allSyllableData = []; // Глобальная переменная для слогов

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
        // This requires access to the feedback element, consider passing it or using a global error handler
        // const feedbackElement = document.querySelector('#game-scrambled-letters .feedback');
        // if (feedbackElement) {
        //     feedbackElement.textContent = 'Ошибка загрузки слов!';
        //     feedbackElement.className = 'feedback error';
        // }
        return false;
    }
}

// --- Function to fetch syllable data ---
async function loadSyllableData() {
    try {
        const response = await fetch('assets/data/syllables.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allSyllableData = await response.json();

        // Optional: Add validation or filtering if needed
        // allSyllableData = allSyllableData.filter(item => item.syllables && item.syllables.length > 0 && item.syllables.length <= 5);

        console.log("Syllable data loaded successfully:", allSyllableData.length, "syllable words");
        return true;
    } catch (error) {
        console.error("Could not load syllable data:", error);
        // Optionally display an error to the user
        // const feedbackElement = document.querySelector('#game-catch-syllables .feedback');
        // if (feedbackElement) {
        //     feedbackElement.textContent = 'Ошибка загрузки слогов!';
        //     feedbackElement.className = 'feedback error';
        // }

        // Fallback to placeholder if loading fails?
        // console.warn("Falling back to placeholder syllable data.");
        // generatePlaceholderSyllableData(); // Need to extract placeholder logic to a function
        // return true; // Or return false if fallback is not desired

        return false; // Indicate failure to load
    }
}

/* // Extracted placeholder logic (optional, if fallback needed)
function generatePlaceholderSyllableData() {
    allSyllableData = allWordsData.map(item => {
        const word = item.word;
        let syllables = [];
        // Simple splitting logic (can be improved)
        if (word.length <= 3) {
            syllables.push(word);
        } else if (word.length === 4) {
            syllables = [word.substring(0, 2), word.substring(2)];
        } else if (word.length === 5) {
            // Example: СО-БА-КА
            if (['А', 'О', 'У', 'Ы', 'Э', 'Я', 'Е', 'Ё', 'Ю', 'И'].includes(word[1]) && !['А', 'О', 'У', 'Ы', 'Э', 'Я', 'Е', 'Ё', 'Ю', 'И'].includes(word[2])){
                syllables = [word.substring(0, 2), word.substring(2)]; // Keep it simple for now
            } else {
                syllables = [word.substring(0, 2), word.substring(2)]; // Example: БА-НАН
            }
        } else { // 6+ letters
            for (let i = 0; i < word.length; i += 2) {
                syllables.push(word.substring(i, Math.min(i + 2, word.length)));
            }
            if(syllables.length > 1 && syllables[syllables.length - 1].length === 1 && syllables[syllables.length - 2].length === 2) {
               syllables[syllables.length - 2] += syllables.pop();
            }
        }
        syllables = syllables.filter(s => s.length > 0);
        return { word: word, syllables: syllables };
    }).filter(item => item.syllables.length > 0 && item.syllables.length <= 5);
    console.log("Placeholder syllable data generated:", allSyllableData.length, "syllable words");
}
*/ 