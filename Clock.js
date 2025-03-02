// Game Constants
const SIZE = 4;
const TILE_SIZE = 100;
const COLORS = {
    0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179",
    16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72",
    256: "#edcc61", 512: "#edc850", 1024: "#edc53f"
};
const TILE_WORDS = {
    2: "Seconds", 4: "Minutes", 8: "Hour", 16: "Day",
    32: "Week", 64: "Month", 128: "Year",
    256: "Decade", 512: "Century", 1024: "Millennium"
};

// Game Variables
let board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

// Update score display
document.getElementById("current-score").innerText = `Score: ${score}`;
document.getElementById("high-score").innerText = `High Score: ${highScore}`;

// Get Canvas Context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = SIZE * TILE_SIZE;
canvas.height = SIZE * TILE_SIZE;

const tryAgainButton = document.getElementById("tryAgainButton");

// Initialize Game
function startGame() {
    addNewTile();
    addNewTile();
    drawBoard();
}

function addNewTile() {
    let emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length > 0) {
        let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Draw Game Board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            let value = board[r][c];
            ctx.fillStyle = COLORS[value] || "#3c3a32";
            ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            if (value !== 0) {
                ctx.fillStyle = "black";
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let text = TILE_WORDS[value] || value;
                ctx.fillText(text, c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2);
            }
        }
    }

    document.getElementById("current-score").innerText = `Score: ${score}`;
    document.getElementById("high-score").innerText = `High Score: ${highScore}`;
}

// Move Tiles
function move(direction) {
    let newBoard = JSON.parse(JSON.stringify(board));
    let pointsGained = 0;

    for (let i = 0; i < SIZE; i++) {
        let row = board[i].filter(val => val);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                pointsGained += row[j];
                row[j + 1] = 0;
            }
        }
        row = row.filter(val => val);
        while (row.length < SIZE) row.push(0);
        board[i] = row;
    }

    if (direction === "right") board.forEach(row => row.reverse());
    if (direction === "down") board = board[0].map((_, c) => board.map(row => row[c])).reverse();
    if (direction === "up") board = board[0].map((_, c) => board.map(row => row[c]));

    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
        score += pointsGained;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        addNewTile();
        drawBoard();
        checkGameOver();
    }
}

// Game Over Check
function checkGameOver() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) return;
            if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return;
            if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return;
        }
    }

    gameOver = true;
    document.getElementById("game-message").innerText = "Game Over! Try Again!";
    tryAgainButton.style.display = "block";
}

tryAgainButton.addEventListener("click", () => {
    board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    gameOver = false;
    score = 0;
    document.getElementById("game-message").innerText = "";
    tryAgainButton.style.display = "none";
    startGame();
});

// Keyboard Controls
document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    if (event.key === "ArrowLeft") move("left");
    if (event.key === "ArrowRight") move("right");
    if (event.key === "ArrowUp") move("up");
    if (event.key === "ArrowDown") move("down");
});

// Start Game
startGame();
