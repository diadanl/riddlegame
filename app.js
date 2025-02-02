let riddles = [];
let currentRiddle = null;
let currentScore = 0;
let maxScore = 10; // Maximum score the player can achieve
let penaltyCount = 0; // Track incorrect attempts, max 5 penalty points

// Reference to the background music, buttons, and modal elements
const backgroundMusic = document.getElementById('backgroundMusic');
const startGameButton = document.getElementById('startGameButton');
const responseHeader = document.getElementById('responseHeader'); // Header for win/lose messages
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

// Function to load riddles from the JSON file
async function loadRiddles() {
    try {
        const response = await fetch('riddles.json');
        if (!response.ok) throw new Error("Failed to load riddles.");
        riddles = await response.json();
        loadNewRiddle(); // Load the first riddle
    } catch (error) {
        console.error("Error loading riddles:", error);
        document.getElementById('riddle').textContent = "Failed to load riddles.";
    }
}

// Add event listener to start the game
startGameButton.addEventListener('click', () => {
    playBackgroundMusic();
    startGameButton.style.display = 'none'; // Hide the "Start Game" button after clicked
    loadRiddles(); // Load riddles after the game starts
    responseHeader.style.display = 'none'; // Hide any previous win/lose messages
});

// Function to play background music
function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch((error) => {
            console.error("Error playing music:", error);
        });
    } else {
        console.error("Background music element not found.");
    }
}

// Function to load a new riddle
function loadNewRiddle() {
    if (riddles.length === 0) return;

    // Get the next riddle from the array
    currentRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    document.getElementById('riddle').textContent = currentRiddle.question;
    document.getElementById('hint').textContent = "";
    document.getElementById('response').textContent = "";
    document.getElementById('answerInput').value = ""; // Clear previous answer
    penaltyCount = 0; // Reset penalty count for new riddle
    updatePenaltyDisplay();
}

function showHint() {
    if (currentRiddle) {
        document.getElementById('hint').textContent = "Hint: " + currentRiddle.hint;
    }
}

// Function to check if the player's answer is correct
function checkAnswer() {
    if (!currentRiddle) return;

    let userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    let correctAnswer = cleanAnswer(currentRiddle.answer);

    if (userAnswer === "") {
        penaltyCount++; // Count empty submissions as a wrong attempt
    } else if (cleanAnswer(userAnswer) === correctAnswer) {
        currentScore++;
        document.getElementById('response').textContent = "Correct! Well done.";
        document.getElementById('score').textContent = `Score: ${currentScore}/${maxScore}`;

        // If the player reaches the max score, they win
        if (currentScore >= maxScore) {
            showModal("You Win! 🎉");
            resetGame();
        } else {
            loadNewRiddle(); // Load next riddle
        }
        return;
    } else {
        penaltyCount++; // Count incorrect answers as penalties
    }

    updatePenaltyDisplay();

    // If player reaches 5 penalty attempts, game is over
    if (penaltyCount >= 5) {
        showModal("You Lose! ⚠ Too many incorrect answers.");
        resetGame();
    } else {
        document.getElementById('response').textContent = "Incorrect! Try again.";
    }

    document.getElementById('answerInput').value = ""; // Clear input after answer
}

// Function to update penalty display
function updatePenaltyDisplay() {
    const penaltyElement = document.getElementById('penalty');
    if (penaltyElement) {
        penaltyElement.textContent = `Penalties: ${penaltyCount} / 5`;
    }
}

// Function to clean up the player's answer to match the correct answer
function cleanAnswer(answer) {
    return answer.replace(/\b(a|an|the)\s+/gi, "").trim().toLowerCase();
}

// Function to reset the game
function resetGame() {
    currentScore = 0;
    penaltyCount = 0;
    document.getElementById('score').textContent = `Score: 0/${maxScore}`;
    document.getElementById('penalty').textContent = `Penalties: 0 / 5`;
    loadNewRiddle();
}

// Function to show the win/lose modal
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block'; // Show the modal
}

// Event listener for the restart button
restartButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
    loadRiddles(); // Restart the game
});

// Event listener for the exit button
exitButton.addEventListener('click', () => {
    window.location.href = "https://github.com/diadanl/riddlegame"; // Redirect to another website
});
