const n = 5; // Number of columns/rows
const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGhe6T1tuSpyz3MrVpZOug7GW00MmpxIUBKf7prIzY9VFxF4UuPSBMNls&s=10";
const puzzleContainer = document.getElementById('puzzle-container');

function initPuzzle() {
    const puzzle = document.createElement('g');
    puzzle.style.setProperty('--i', `url(${imageUrl})`);
    puzzleContainer.appendChild(puzzle);

    for (let i = 0; i < n * n; i++) {
        const piece = document.createElement('z');
        const a = document.createElement('a');
        const b = document.createElement('b');
        b.draggable = true;
        piece.appendChild(a);
        piece.appendChild(b);
        puzzle.appendChild(piece);
    }
}

initPuzzle();
