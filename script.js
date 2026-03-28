// Words for each level
const words = {
    easy: ["cat", "sun", "run", "big", "red", "dog", "egg", "fun", "sky", "pie", "tea", "key", "car", "hat", "pen", "art", "sea", "bed", "cup", "arm"],
    medium: ["hello", "world", "apple", "river", "happy", "house", "light", "dream", "music", "smile", "earth", "water", "friend", "summer", "winter"],
    hard: ["javascript", "developer", "programming", "challenge", "keyboard", "asynchronous", "algorithm", "documentation", "framework", "optimization", "component", "variable", "function", "conditional", "statement"]
};

let currentLevel;
let currentWords;
let currentWord;
let score = 0;
let time = 60;
let timer;

const levelSelection = document.getElementById("level-selection");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");

easyBtn.addEventListener("click", () => startGame("easy"));
mediumBtn.addEventListener("click", () => startGame("medium"));
hardBtn.addEventListener("click", () => startGame("hard"));
playAgainBtn.addEventListener("click", playAgain);

wordInput.addEventListener("input", handleInput);

function handleInput() {
    const typedValue = wordInput.value;
    const currentWordPart = currentWord.substring(0, typedValue.length);

    if (typedValue === currentWord) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        wordInput.value = "";
        showNewWord();
    } else if (typedValue === currentWordPart) {
        wordInput.classList.remove("incorrect");
        wordInput.classList.add("correct");
    } else {
        wordInput.classList.remove("correct");
        wordInput.classList.add("incorrect");
    }
}

function startGame(level) {
    currentLevel = level;
    currentWords = words[currentLevel];
    score = 0;
    time = 60;
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Time: ${time}`;

    levelSelection.style.display = "none";
    gameScreen.style.display = "block";
    wordInput.focus();

    showNewWord();
    startTimer();
}

function showNewWord() {
    wordInput.classList.remove("correct", "incorrect");
    const randomIndex = Math.floor(Math.random() * currentWords.length);
    currentWord = currentWords[randomIndex];
    wordDisplay.innerText = currentWord;
    wordDisplay.style.animation = 'none';
    setTimeout(() => {
        wordDisplay.style.animation = '';
    }, 10);
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        timerDisplay.innerText = `Time: ${time}`;
        if (time === 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "block";
    finalScore.innerText = score;
}

function playAgain() {
    gameOverScreen.style.display = "none";
    levelSelection.style.display = "block";
    time = 60;
    score = 0;
}