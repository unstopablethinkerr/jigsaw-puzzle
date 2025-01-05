 let selectedImage = null;
let startTime = null;
let timerInterval = null;
let puzzlePieces = [];

function startGame(imageElement) {
    selectedImage = imageElement.src;
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    startTimer();
    initializePuzzle();
}

function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('timer').innerText = `Time: ${elapsedTime}s`;
}

function initializePuzzle() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = ''; // Clear previous pieces
    puzzlePieces = [];

    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
        const pieceSize = img.width / 5;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.style.backgroundImage = `url('${selectedImage}')`;
                piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.draggable = true;
                piece.addEventListener('dragstart', dragStart);
                piece.addEventListener('dragover', dragOver);
                piece.addEventListener('drop', drop);
                container.appendChild(piece);
                puzzlePieces.push(piece);
            }
        }
        shufflePieces();
    };
}

function shufflePieces() {
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
    }
    puzzlePieces.forEach(piece => document.getElementById('puzzle-container').appendChild(piece));
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', null);
    event.dataTransfer.effectAllowed = 'move';
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function drop(event) {
    event.preventDefault();
    const target = event.target;
    const draggedOverPiece = puzzlePieces.find(piece => piece === target);
    const draggedPiece = puzzlePieces.find(piece => piece.dataset.row === event.dataTransfer.getData('text/plain'));

    if (draggedPiece && draggedOverPiece) {
        const tempRow = draggedPiece.dataset.row;
        const tempCol = draggedPiece.dataset.col;
        draggedPiece.dataset.row = draggedOverPiece.dataset.row;
        draggedPiece.dataset.col = draggedOverPiece.dataset.col;
        draggedOverPiece.dataset.row = tempRow;
        draggedOverPiece.dataset.col = tempCol;

        const tempStyle = draggedPiece.style.backgroundPosition;
        draggedPiece.style.backgroundPosition = draggedOverPiece.style.backgroundPosition;
        draggedOverPiece.style.backgroundPosition = tempStyle;

        checkCompletion();
    }
}

function checkCompletion() {
    const isCompleted = puzzlePieces.every(piece => {
        const row = piece.dataset.row;
        const col = piece.dataset.col;
        const expectedPosition = `-${col * 100}px -${row * 100}px`;
        return piece.style.backgroundPosition === expectedPosition;
    });

    if (isCompleted) {
        completePuzzle();
    }
}

function completePuzzle() {
    clearInterval(timerInterval);
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('completion-screen').style.display = 'flex';
    document.getElementById('completion-time').innerText = `Time Taken: ${elapsedTime}s`;
}

function shareResult() {
    const elapsedTime = document.getElementById('completion-time').innerText;
    const shareText = `I completed the puzzle in ${elapsedTime}!`;
    if (navigator.share) {
        navigator.share({
            title: 'Puzzle Completed',
            text: shareText,
            url: window.location.href
        }).catch(err => console.error(err));
    } else {
        alert('Share feature is not supported in your browser.');
    }
}
