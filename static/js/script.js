document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');

    let board = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ];

    function createTile(value, x, y) {
        const tile = document.createElement('div');
        tile.classList.add('tile', `tile-${value}`);
        tile.textContent = value;
        tile.style.gridRowStart = x + 1;
        tile.style.gridColumnStart = y + 1;
        gameBoard.appendChild(tile);
    }

    function addRandomTile() {
        const emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === null) {
                    emptyTiles.push({ x: i, y: j });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            board[x][y] = value;
            createTile(value, x, y);
        }
    }

    function isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i < 3 && board[i][j] === board[i + 1][j]) {
                    return false;
                }
                if (j < 3 && board[i][j] === board[i][j + 1]) {
                    return false;
                }
            }
        }

        return true;
    }

    function moveTiles(direction) {
        let moved = false;
        const prevBoard = JSON.parse(JSON.stringify(board)); // Copy previous state
        gameBoard.innerHTML = '';

        const mergeTiles = (arr) => {
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] !== null && arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    arr[i + 1] = null;
                    moved = true;
                }
            }
            return arr.filter(val => val !== null).concat(new Array(4).fill(null).slice(arr.filter(val => val !== null).length));
        };

        switch (direction) {
            case 'ArrowUp':
                for (let y = 0; y < 4; y++) {
                    let col = [board[0][y], board[1][y], board[2][y], board[3][y]].filter(val => val !== null);
                    col = mergeTiles(col);
                    for (let x = 0; x < 4; x++) {
                        board[x][y] = col[x] || null;
                        if (col[x] !== undefined) moved = true;
                    }
                }
                break;
            case 'ArrowDown':
                for (let y = 0; y < 4; y++) {
                    let col = [board[3][y], board[2][y], board[1][y], board[0][y]].filter(val => val !== null);
                    col = mergeTiles(col);
                    for (let x = 0; x < 4; x++) {
                        board[3 - x][y] = col[x] || null;
                        if (col[x] !== undefined) moved = true;
                    }
                }
                break;
            case 'ArrowLeft':
                for (let x = 0; x < 4; x++) {
                    let row = [board[x][0], board[x][1], board[x][2], board[x][3]].filter(val => val !== null);
                    row = mergeTiles(row);
                    for (let y = 0; y < 4; y++) {
                        board[x][y] = row[y] || null;
                        if (row[y] !== undefined) moved = true;
                    }
                }
                break;
            case 'ArrowRight':
                for (let x = 0; x < 4; x++) {
                    let row = [board[x][3], board[x][2], board[x][1], board[x][0]].filter(val => val !== null);
                    row = mergeTiles(row);
                    for (let y = 0; y < 4; y++) {
                        board[x][3 - y] = row[y] || null;
                        if (row[y] !== undefined) moved = true;
                    }
                }
                break;
        }

        // Apply the transitions
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (prevBoard[i][j] !== board[i][j] || board[i][j] !== null) {
                    createTile(board[i][j], i, j);
                }
            }
        }

        if (moved) addRandomTile();

        if (isGameOver()) {
            alert("Game Over!");
        }
    }

    function resetGame() {
        board = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        gameBoard.innerHTML = '';
        addRandomTile();
        addRandomTile();
    }

    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            moveTiles(event.key);
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
        document.body.classList.add('no-scroll');
    }

    function handleTouchMove(event) {
        if (event.touches.length > 1) return; // Ignore multiple touches
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    }

    function handleTouchEnd() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        document.body.classList.remove('no-scroll');

        if (Math.max(absDeltaX, absDeltaY) > 20) { // Minimum swipe distance
            if (absDeltaX > absDeltaY) {
                if (deltaX > 0) {
                    moveTiles('ArrowRight');
                } else {
                    moveTiles('ArrowLeft');
                }
            } else {
                if (deltaY > 0) {
                    moveTiles('ArrowDown');
                } else {
                    moveTiles('ArrowUp');
                }
            }
        }
    }

    gameBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
    gameBoard.addEventListener('touchmove', handleTouchMove, { passive: true });
    gameBoard.addEventListener('touchend', handleTouchEnd);

    // Mouse drag functionality
    let mouseDown = false;
    let startX = 0;
    let startY = 0;

    gameBoard.addEventListener('mousedown', (event) => {
        mouseDown = true;
        startX = event.clientX;
        startY = event.clientY;
    });

    gameBoard.addEventListener('mousemove', (event) => {
        if (!mouseDown) return;
        const endX = event.clientX;
        const endY = event.clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (Math.max(absDeltaX, absDeltaY) > 20) {
            if (absDeltaX > absDeltaY) {
                if (deltaX > 0) {
                    moveTiles('ArrowRight');
                } else {
                    moveTiles('ArrowLeft');
                }
            } else {
                if (deltaY > 0) {
                    moveTiles('ArrowDown');
                } else {
                    moveTiles('ArrowUp');
                }
            }
            mouseDown = false;
        }
    });

    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    resetButton.addEventListener('click', resetGame);

    resetGame();
});
