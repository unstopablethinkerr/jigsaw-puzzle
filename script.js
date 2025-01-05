
let timer;
let timeElapsed = 0;
let gridSize = 3; // Change this for difficulty (e.g., 3 = 3x3 grid)
let pieces = [];
let emptyPiece;

// Initialize game
function startGame(imageSrc) {
  // Hide start screen, show game screen
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");

  // Reset timer
  timeElapsed = 0;
  document.getElementById("timer").innerText = "Time: 0s";

  // Prepare puzzle
  initializePuzzle(imageSrc);
  startTimer();
}

function initializePuzzle(imageSrc) {
  const container = document.getElementById("puzzle-container");
  container.innerHTML = ""; // Clear previous puzzle pieces
  pieces = [];

  // Calculate piece size
  const pieceSize = 100 / gridSize; // Percentage for CSS grid

  // Create puzzle pieces
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.width = `${pieceSize}%`;
      piece.style.height = `${pieceSize}%`;
      piece.style.backgroundImage = `url(${imageSrc})`;
      piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
      piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
      piece.dataset.row = row;
      piece.dataset.col = col;

      // Add click event
      piece.addEventListener("click", () => movePiece(piece));

      pieces.push(piece);
    }
  }

  // Shuffle and render pieces
  shufflePieces();
  renderPieces(container);
}

function shufflePieces() {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  // Ensure puzzle is solvable and has one empty piece
  emptyPiece = pieces.pop(); // Use the last piece as the empty slot
  emptyPiece.classList.add("empty");
}

function renderPieces(container) {
  pieces.forEach((piece) => {
    container.appendChild(piece);
  });
  container.appendChild(emptyPiece); // Add the empty slot
}

function movePiece(piece) {
  // Find the empty piece's position
  const emptyRow = parseInt(emptyPiece.dataset.row);
  const emptyCol = parseInt(emptyPiece.dataset.col);
  const row = parseInt(piece.dataset.row);
  const col = parseInt(piece.dataset.col);

  // Check if the clicked piece is adjacent to the empty slot
  if (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1)
  ) {
    // Swap positions
    swapPieces(piece, emptyPiece);
    if (isPuzzleSolved()) {
      stopTimer();
      showCompletionScreen();
    }
  }
}

function swapPieces(piece, emptyPiece) {
  // Swap visual positions
  [piece.dataset.row, emptyPiece.dataset.row] = [
    emptyPiece.dataset.row,
    piece.dataset.row,
  ];
  [piece.dataset.col, emptyPiece.dataset.col] = [
    emptyPiece.dataset.col,
    piece.dataset.col,
  ];

  // Re-render pieces
  const container = document.getElementById("puzzle-container");
  renderPieces(container);
}

function startTimer() {
  timer = setInterval(() => {
    timeElapsed++;
    document.getElementById("timer").innerText = `Time: ${timeElapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function isPuzzleSolved() {
  return pieces.every(
    (piece, index) =>
      piece.dataset.row == Math.floor(index / gridSize) &&
      piece.dataset.col == index % gridSize
  );
}

function showCompletionScreen() {
  // Hide game screen, show end screen
  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("end-screen").classList.add("active");

  // Display final time
  document.getElementById("final-time").innerText = `${timeElapsed}s`;
}

function restartGame() {
  window.location.reload(); // Reload the page to reset
}

function playAgain() {
  // Hide end screen, show start screen
  document.getElementById("end-screen").classList.remove("active");
  document.getElementById("start-screen").classList.add("active");
}

function shareResult() {
  const shareText = `I completed the puzzle in ${timeElapsed} seconds! Can you beat my time?`;
  if (navigator.share) {
    navigator
      .share({
        title: "Jigsaw Puzzle Game",
        text: shareText,
        url: window.location.href,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing", error));
  } else {
    alert(shareText);
  }
}
