// script.js

const board = document.getElementById("board");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill("");
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// AI Function (Minimax Algorithm)
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  boardState[move] = "O";
  updateBoard();
  currentPlayer = "X";
}

function minimax(board, depth, isMaximizing) {
  if (checkWin()) return isMaximizing ? -1 : 1;
  if (checkDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Create the board dynamically
function createBoard() {
  board.innerHTML = "";
  boardState.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.setAttribute("data-index", index);
    cellDiv.textContent = cell;
    board.appendChild(cellDiv);
  });
}

// Check if there's a winner
function checkWin() {
  return winningCombinations.some((combination) => {
    if (
      boardState[combination[0]] === currentPlayer &&
      boardState[combination[1]] === currentPlayer &&
      boardState[combination[2]] === currentPlayer
    ) {
      highlightWinningCells(combination);
      return true;
    }
    return false;
  });
}

// Highlight winning cells
function highlightWinningCells(combination) {
  combination.forEach((index) => {
    document
      .querySelector(`.cell[data-index='${index}']`)
      .classList.add("win");
  });
}

// Check for a draw
function checkDraw() {
  return boardState.every((cell) => cell !== "");
}

// Handle a cell click
function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");
  if (boardState[index] !== "" || !gameActive || currentPlayer === "O") return;

  boardState[index] = currentPlayer;
  updateBoard();

  if (checkWin()) {
    message.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    message.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  message.textContent = `Player ${currentPlayer}'s turn`;
  setTimeout(bestMove, 500);
}

// Update the board UI
function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = boardState[index];
    cell.className = `cell ${boardState[index].toLowerCase()}`;
  });
}

// Restart the game
function restartGame() {
  currentPlayer = "X";
  gameActive = true;
  boardState = Array(9).fill("");
  message.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
  attachEventListeners();
}

// Attach click events to cells
function attachEventListeners() {
  document.querySelectorAll(".cell").forEach((cell) =>
    cell.addEventListener("click", handleCellClick)
  );
}

// Initialize the game
createBoard();
attachEventListeners();
restartButton.addEventListener("click", restartGame);
message.textContent = `Player ${currentPlayer}'s turn`;
