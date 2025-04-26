# Contributing to Kids Dyslexia Games

This document provides guidelines for contributing to the Kids Dyslexia Games project.

## Tech Stack

*   **Frontend:** HTML, CSS, vanilla JavaScript (ES6+)
*   **Libraries:** interact.js (for drag and drop functionality)
*   **Data:** JSON files for game words and syllables (`assets/data/`)
*   **Assets:** Static images and sound files (`assets/images/`, `assets/sounds/`)

## Project Structure

```
.
├── assets/
│   ├── data/         # JSON data files (words.json, syllables.json)
│   ├── images/       # Static image assets
│   └── sounds/       # Sound effect files
├── css/
│   └── style.css     # Main stylesheet
├── js/
│   ├── data-loader.js # Functions for loading JSON data
│   ├── effects.js     # Visual effects (confetti, fireworks)
│   ├── game-scrambled-letters.js # Logic for the "Scrambled Letters" game
│   ├── games.js       # Logic for the "Catch Syllables" game (and potentially others)
│   └── main.js        # Main script for initialization, slide navigation, game setup
├── index.html        # Main HTML file with game containers and structure
├── CONTRIBUTING.md   # These contribution guidelines
├── README.md         # Project overview
└── ... (config files like .gitignore, LICENSE)
```

## Making Changes

1.  **Understand the Goal:** Before coding, make sure you understand the task or bug you are addressing.
2.  **Branching (if using Git):** Create a new branch for your changes (e.g., `feature/new-game-mechanic`, `fix/syllable-loading-bug`).
3.  **Code Implementation:**
    *   Follow existing code style and patterns.
    *   Keep functions focused on a single task.
    *   Add comments for complex or non-obvious logic.
    *   Update relevant data files (`words.json`, `syllables.json`) if necessary.
4.  **Testing:**
    *   Test your changes thoroughly in the browser.
    *   Check the browser's developer console for errors or warnings.
    *   Test edge cases (e.g., what happens if data fails to load?).
5.  **Code Review (if applicable):** If working in a team, request a code review.
6.  **Committing (if using Git):**
    *   Write clear and concise commit messages (e.g., "Feat: Add sound effects", "Fix: Syllable dropzone logic").
    *   Commit related changes together.
7.  **Merging (if using Git):** Merge your branch back into the main branch once approved and tested.

## Working with Files

*   **`index.html`**: Defines the structure of the different game "slides" or sections. Modifications here are usually for layout or adding new game containers.
*   **`css/style.css`**: Contains all styling. Try to keep it organized, perhaps using comments to delineate sections for different games or components.
*   **`js/main.js`**: Handles the overall application flow, including initializing games when their respective slides become active and managing navigation between slides.
*   **`js/data-loader.js`**: Responsible for fetching data from the JSON files. Add new loading functions here if new data sources are needed.
*   **`js/games.js` / `js/game-*.js`**: Each game should ideally have its logic self-contained or within clearly defined functions/objects in these files.
    *   `game-scrambled-letters.js`: Contains logic specific to the "Scrambled Letters" game.
    *   `games.js`: Currently contains "Catch Syllables" logic. Consider refactoring if more games are added, perhaps creating separate files like `game-catch-syllables.js`.
*   **`js/effects.js`**: Contains reusable visual effects.
*   **`assets/data/*.json`**: Edit these files carefully to add or modify game content (words, syllables). Ensure the JSON format remains valid.

## Linting and Formatting

*   Currently, there doesn't seem to be an automated linter or formatter set up.
*   Maintain consistent indentation (e.g., 4 spaces).
*   Follow standard JavaScript conventions (e.g., use `const` and `let` appropriately, use strict equality `===`).
*   Ensure JSON files are valid (no trailing commas, no comments). 