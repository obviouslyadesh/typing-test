const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed is measured in words per minute.",
    "Practice makes perfect when improving typing skills.",
    "Fast fingers help with quick and accurate typing.",
    "Coding is fun when you type at a high speed."
];

let startTime, interval;
let sentenceText = document.getElementById("sentence");
let inputField = document.getElementById("inputText");
let timeDisplay = document.getElementById("time");
let wpmDisplay = document.getElementById("wpm");
let accuracyDisplay = document.getElementById("accuracy");
let errorsDisplay = document.getElementById("errors");

// Load random sentence on page load
function loadSentence() {
    let randomIndex = Math.floor(Math.random() * sentences.length);
    sentenceText.textContent = sentences[randomIndex];
    inputField.value = "";
    timeDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    errorsDisplay.textContent = "0";
}

window.onload = loadSentence;

// Start typing test
function startTyping() {
    if (!startTime) {
        startTime = new Date();
        interval = setInterval(updateStats, 1000);
    }
    checkTyping();
}

// Check typing progress
function checkTyping() {
    let inputText = inputField.value;
    let targetText = sentenceText.textContent;

    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === targetText[i]) {
            correctChars++;
        } else {
            errors++;
        }
    }

    let accuracy = (correctChars / targetText.length) * 100;
    accuracyDisplay.textContent = accuracy.toFixed(2) + "%";
    errorsDisplay.textContent = errors;
}

// Update WPM and time
function updateStats() {
    let elapsedTime = (new Date() - startTime) / 1000;
    timeDisplay.textContent = elapsedTime.toFixed(0);

    let wordsTyped = inputField.value.split(" ").length;
    let wpm = (wordsTyped / elapsedTime) * 60;
    
    wpmDisplay.textContent = wpm.toFixed(2);
}

// Reset test
function resetTest() {
    clearInterval(interval);
    startTime = null;
    loadSentence();
}
