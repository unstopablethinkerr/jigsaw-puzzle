document.addEventListener('DOMContentLoaded', () => {
    const selectionScreen = document.getElementById('selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const completionScreen = document.getElementById('completion-screen');
    const timerDisplay = document.getElementById('timer');
    const puzzleContainer = document.getElementById('puzzle-container');
    const completionTimeDisplay = document.getElementById('completion-time');

    let selectedImage = null;
    let startTime = null;
    let timerInterval = null;
    let puzzlePieces = [];
    const gridSize = 4; // 4x4 grid

    // Initialize image selection
    document.querySelectorAll('.image-selection button').forEach(button => {
        button.addEventListener('click', () => {
            selectedImage = button.querySelector('img').src;
            startGame();
        });
    });

    function startGame() {
        selectionScreen.hidden = true;
        gameScreen.hidden = false;
        startTimer();
        initializePuzzle();
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }

    function initializePuzzle() {
        puzzleContainer.innerHTML = '';
        puzzlePieces = [];

        const img = new Image();
        img.src = selectedImage;
        img.onload = () => {
            const pieceWidth = img.width / gridSize;
            const pieceHeight = img.height / gridSize;

            // Create puzzle pieces
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const piece = document.createElement('div');
                    piece.className = 'puzzle-piece';
                    piece.style.width = `${pieceWidth}px`;
                    piece.style.height = `${pieceHeight}px`;
                    piece.style.backgroundImage = `url('${selectedImage}')`;
                    piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    piece.draggable = true;
                    piece.addEventListener('dragstart', dragStart);
                    piece.addEventListener('dragover', dragOver);
                    piece.addEventListener('drop', drop);
                    puzzleContainer.appendChild(piece);
                    puzzlePieces.push(piece);
                }
            }

            // Shuffle and display pieces
            shufflePieces();
            puzzlePieces.forEach(piece => puzzleContainer.appendChild(piece));
        };
    }

    function shufflePieces() {
        for (let i = puzzlePieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
        }
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', `${event.target.dataset.row},${event.target.dataset.col}`);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const [draggedRow, draggedCol] = event.dataTransfer.getData('text/plain').split(',').map(Number);
        const targetPiece = event.target;
        const draggedPiece = puzzlePieces.find(piece => piece.dataset.row == draggedRow && piece.dataset.col == draggedCol);

        if (draggedPiece && targetPiece && draggedPiece !== targetPiece) {
            // Swap dataset values
            [draggedPiece.dataset.row, targetPiece.dataset.row] = [targetPiece.dataset.row, draggedPiece.dataset.row];
            [draggedPiece.dataset.col, targetPiece.dataset.col] = [targetPiece.dataset.col, draggedPiece.dataset.col];

            // Swap positions in the DOM
            const draggedIndex = puzzlePieces.indexOf(draggedPiece);
            const targetIndex = puzzlePieces.indexOf(targetPiece);
            puzzlePieces[draggedIndex] = targetPiece;
            puzzlePieces[targetIndex] = draggedPiece;

            // Re-render pieces
            puzzleContainer.innerHTML = '';
            puzzlePieces.forEach(piece => puzzleContainer.appendChild(piece));

            checkCompletion();
        }
    }

    function checkCompletion() {
        const isCompleted = puzzlePieces.every(piece => {
            const row = piece.dataset.row;
            const col = piece.dataset.col;
            const expectedPosition = `-${col * piece.offsetWidth}px -${row * piece.offsetHeight}px`;
            return piece.style.backgroundPosition === expectedPosition;
        });

        if (isCompleted) {
            completePuzzle();
        }
    }

    function completePuzzle() {
        clearInterval(timerInterval);
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        gameScreen.hidden = true;
        completionScreen.hidden = false;
        completionTimeDisplay.textContent = `Time Taken: ${elapsedTime}s`;
    }

    document.getElementById('share-button').addEventListener('click', shareResult);

    function shareResult() {
        const elapsedTime = completionTimeDisplay.textContent;
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
});