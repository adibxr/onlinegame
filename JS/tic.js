// Screen references
const homeScreen = document.getElementById("homeScreen");
const levelSelection = document.getElementById("levelSelection");
const gameContainer = document.getElementById("gameContainer");
const reportScreen = document.getElementById("reportScreen");

// Buttons and UI elements
const playWithComputerButton = document.getElementById("playWithComputer");
const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const hardButton = document.getElementById("hard");
const board = document.getElementById("board");
const message = document.getElementById("message");
const nextRoundButton = document.getElementById("nextRound");
const endMatchButton = document.getElementById("endMatch");
const checkScoreButton = document.getElementById("checkScore");
const report = document.getElementById("report");
const playAgainButton = document.getElementById("playAgain");
const pointsDisplay = document.getElementById("pointsDisplay");
const notificationContainer = document.getElementById("notification");

// Game variables
let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill("");
let round = 1;
let totalRounds = 5;
let playerPoints = 0;
let ties = 0;
let playerWins = 0;
let computerWins = 0;
let selectedLevel = "";

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

// Screen Transitions
playWithComputerButton.addEventListener("click", () => {
  homeScreen.classList.remove("active");
  levelSelection.classList.add("active");
});

[easyButton, mediumButton, hardButton].forEach((button, index) => {
  button.addEventListener("click", () => {
    selectedLevel = ["easy", "medium", "hard"][index];
    levelSelection.classList.remove("active");
    gameContainer.classList.add("active");
    startGame();
  });
});

playAgainButton.addEventListener("click", () => {
  resetGame();
  reportScreen.classList.remove("active");
  homeScreen.classList.add("active");
});

endMatchButton.addEventListener("click", showFinalReport);

nextRoundButton.addEventListener("click", () => {
  round++;
  if (round > totalRounds) {
    showFinalReport();
  } else {
    startGame();
  }
});

checkScoreButton.addEventListener("click", showFinalReport);

// Start the game
function startGame() {
  gameActive = true;
  currentPlayer = "X";
  boardState = Array(9).fill("");
  createBoard();
  message.textContent = `Player ${currentPlayer}'s turn`;
  pointsDisplay.textContent = `Points: ${playerPoints}`;
  updateButtons();
}

function createBoard() {
  board.innerHTML = "";
  boardState.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  });
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (!gameActive || boardState[index]) return;

  boardState[index] = currentPlayer;
  updateBoard();

  if (checkWin(currentPlayer)) {
    endRound("win");
  } else if (boardState.every((cell) => cell)) {
    endRound("tie");
  } else {
    currentPlayer = "O";
    message.textContent = `Player ${currentPlayer}'s turn`;
    computerMove();
  }
}

function computerMove() {
  setTimeout(() => {
    const index = getComputerMove();
    boardState[index] = "O";
    updateBoard();

    if (checkWin(currentPlayer)) {
      endRound("loss");
    } else if (boardState.every((cell) => cell)) {
      endRound("tie");
    } else {
      currentPlayer = "X";
      message.textContent = `Player ${currentPlayer}'s turn`;
    }
  }, 500);
}

function getComputerMove() {
  if (selectedLevel === "easy") {
    return boardState.findIndex((cell) => !cell);
  } else if (selectedLevel === "medium") {
    const available = boardState
      .map((cell, idx) => (!cell ? idx : null))
      .filter((idx) => idx !== null);
    return available[Math.floor(Math.random() * available.length)];
  } else {
    return bestMove();
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  boardState.forEach((cell, index) => {
    if (!cell) {
      boardState[index] = "O";
      const score = minimax(boardState, 0, false);
      boardState[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (board.every((cell) => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (!cell) {
        board[index] = "O";
        const score = minimax(board, depth + 1, false);
        board[index] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (!cell) {
        board[index] = "X";
        const score = minimax(board, depth + 1, true);
        board[index] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = boardState[index];
    cell.classList.toggle("x", boardState[index] === "X");
    cell.classList.toggle("o", boardState[index] === "O");
  });
}

function checkWin(player) {
  return winningCombinations.some((combination) =>
    combination.every((index) => boardState[index] === player)
  );
}

function endRound(result) {
  gameActive = false;
  highlightWinningLine();

  if (result === "win") {
    playerPoints += 5;
    playerWins++;
    message.textContent = "You won!";
    showNotification("You won! +5 points", "win");
  } else if (result === "tie") {
    playerPoints += 3;
    ties++;
    message.textContent = "It's a tie!";
    showNotification("It's a tie! +3 points", "tie");
  } else {
    playerPoints -= 1;
    computerWins++;
    message.textContent = "You lost!";
    showNotification("You lost! -1 point", "loss");
  }

  pointsDisplay.textContent = `Points: ${playerPoints}`;
}

function highlightWinningLine() {
  winningCombinations.forEach((combination) => {
    if (combination.every((index) => boardState[index] === currentPlayer)) {
      combination.forEach((index) => {
        document.querySelectorAll(".cell")[index].classList.add("win");
      });
    }
  });
}

function updateButtons() {
  if (round === totalRounds) {
    nextRoundButton.style.display = "none";
    checkScoreButton.style.display = "block";
  } else {
    nextRoundButton.style.display = "block";
    checkScoreButton.style.display = "none";
  }
}

function showNotification(text, type) {
  notificationContainer.textContent = text;

  // Change background color based on the type of result
  if (type === "win") {
    notificationContainer.style.backgroundColor = "#4caf50"; // Green for win
  } else if (type === "tie") {
    notificationContainer.style.backgroundColor = "#f5ba42"; // Yellow for tie
  } else if (type === "loss") {
    notificationContainer.style.backgroundColor = "#f44336"; // Red for loss
  }

  notificationContainer.style.display = "block";

  setTimeout(() => {
    notificationContainer.style.display = "none";
  }, 4000);
}

function showFinalReport() {
  gameContainer.classList.remove("active");
  reportScreen.classList.add("active");
  report.innerHTML = `
    <h2>Summary</h2>
    <p>Player Wins: ${playerWins}</p>
    <p>Computer Wins: ${computerWins}</p>
    <p>Ties: ${ties}</p>
    <p>Final Score: ${playerPoints}</p>
  `;
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  boardState = Array(9).fill("");
  round = 1;
  playerPoints = 0;
  playerWins = 0;
  computerWins = 0;
  ties = 0;
}
