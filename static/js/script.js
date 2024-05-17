document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');

    // Function to create a tile
    function createTile(value) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = value;
        gameBoard.appendChild(tile);
    }

    // Initialize the game board with two tiles
    createTile(2);
    createTile(4);
});
