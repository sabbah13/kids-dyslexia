let allWordsData = []; // Глобальная переменная для слов (оставляем как fallback/для совместимости)
let allSyllableData = []; // Глобальная переменная для слогов (оставляем как fallback/для совместимости)

// --- Function to fetch word data ---
async function loadWordData() {
    try {
        const response = await fetch('assets/data/words.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allWordsData = data; // Assign to global as well
        console.log("Word data loaded successfully:", allWordsData.length, "words");
        return data; // Return the data
    } catch (error) {
        console.error("Could not load word data:", error);
        return null; // Return null on error
    }
}

// --- Function to fetch syllable data ---
async function loadSyllableData() {
    try {
        const response = await fetch('assets/data/syllables.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allSyllableData = data; // Assign to global as well
        console.log("Syllable data loaded successfully:", allSyllableData.length, "syllable words");
        return data; // Return the data
    } catch (error) {
        console.error("Could not load syllable data:", error);
        return null; // Return null on error
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