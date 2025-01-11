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
  if (boardState[index] !== "" || !gameActive) return;

  boardState[index] = currentPlayer;
  event.target.textContent = currentPlayer;

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

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Player ${currentPlayer}'s turn`;
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
