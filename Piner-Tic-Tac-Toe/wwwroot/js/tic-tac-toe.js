let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = ""; // "multiplayer" or "ai"
let connection = null;

// Initialize the board
document.addEventListener("DOMContentLoaded", async () => {
    while (!window.connection || window.connection.state !== "Connected") {
        console.log("Waiting for SignalR...");
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait until connected
    }

    console.log("SignalR is ready! Running Tic-Tac-Toe script...");

    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleMove);
        boardContainer.appendChild(cell);
    }
});


// Set game mode
function setMode(selectedMode) {
    mode = selectedMode;
    if (mode === "multiplayer") {
        setupSignalR();
    }
    resetGame();
}

// Handle move
function handleMove(event) {
    const index = event.target.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.classList.add("taken");

    if (mode === "multiplayer" && connection) {
        connection.invoke("MakeMove", index, currentPlayer);
    }

    checkWinner();

    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (mode === "ai" && currentPlayer === "O") {
            setTimeout(aiMove, 500);
        }
    }
}

// AI Move (Random AI for simplicity)
function aiMove() {
    let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (move !== undefined) {
        board[move] = "O";
        document.querySelector(`[data-index='${move}']`).innerText = "O";
        document.querySelector(`[data-index='${move}']`).classList.add("taken");

        checkWinner();
        currentPlayer = "X";
    }
}

// Check winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("status").innerText = `${board[a]} Wins!`;
            updateScore(board[a]);
            gameActive = false;
            return;
        }
    }

    if (!board.includes("")) {
        document.getElementById("status").innerText = "It's a Draw!";
        updateScore("draw");
        gameActive = false;
    }
}

// Update Scoreboard
function updateScore(winner) {
    if (winner === "X") document.getElementById("x-wins").innerText++;
    else if (winner === "O") document.getElementById("o-wins").innerText++;
    else if (winner === "draw") document.getElementById("draws").innerText++;
}

// Reset game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll(".cell").forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("taken");
    });
    document.getElementById("status").innerText = "";
    gameActive = true;
    currentPlayer = "X";
}

// Multiplayer setup using SignalR
function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/gameHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start().then(() => console.log("Connected to SignalR"));

    connection.on("ReceiveMove", (index, player) => {
        board[index] = player;
        let cell = document.querySelector(`[data-index='${index}']`);
        cell.innerText = player;
        cell.classList.add("taken");
        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    });
}


