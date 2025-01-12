const n = 5; // Number of columns/rows
const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGhe6T1tuSpyz3MrVpZOug7GW00MmpxIUBKf7prIzY9VFxF4UuPSBMNls&s=10";
const puzzleContainer = document.getElementById('puzzle-container');

let pieces = [];
let correctPositions = [];

function initPuzzle() {
    for (let i = 0; i < n * n; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `-${i % n * 100}px -${Math.floor(i / n) * 100}px`;
        piece.dataset.index = i;
        pieces.push(piece);
        correctPositions.push(i);
        puzzleContainer.appendChild(piece);
    }

    pieces = shuffle(pieces);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);
        piece.addEventListener('dragend', dragEnd);
    });
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const droppedIndex = e.target.dataset.index;
    const draggedPiece = pieces.find(piece => piece.dataset.index === draggedIndex);
    const droppedPiece = pieces.find(piece => piece.dataset.index === droppedIndex);

    puzzleContainer.insertBefore(draggedPiece, droppedPiece);

    const temp = draggedPiece.dataset.index;
    draggedPiece.dataset.index = droppedPiece.dataset.index;
    droppedPiece.dataset.index = temp;

    checkCorrectPositions();
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function checkCorrectPositions() {
    pieces.forEach((piece, index) => {
        if (piece.dataset.index == correctPositions[index]) {
            piece.classList.add('correct');
        } else {
            piece.classList.remove('correct');
        }
    });
}

initPuzzle();
