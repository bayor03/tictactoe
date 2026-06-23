// script.js
(function() {
  // ----- Game state -----
  let board = Array(9).fill(null);          // null, 'X', 'O'
  let currentPlayer = 'X';                  // 'X' or 'O'
  let gameActive = true;
  let winner = null;                       // null, 'X', 'O', or 'tie'

  const boardElement = document.getElementById('board');
  const statusElement = document.getElementById('statusMessage');

  // Winning combinations (indexes 0-8)
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
    [0, 4, 8], [2, 4, 6]              // diagonals
  ];

  // ----- Render board -----
  function renderBoard() {
    boardElement.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.dataset.index = i;
      tile.textContent = board[i] || '';

      if (board[i] !== null || !gameActive || winner) {
        tile.classList.add('disabled-tile');
      } else {
        tile.classList.remove('disabled-tile');
      }

      if (winner && winner !== 'tie') {
        const winCombo = getWinningCombo();
        if (winCombo && winCombo.includes(i)) {
          tile.classList.add('winner-highlight');
        }
      }

      tile.addEventListener('click', tileClickHandler);
      boardElement.appendChild(tile);
    }

    updateStatus();
  }

  // ----- Get winning combination (if any) -----
  function getWinningCombo() {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return pattern;
      }
    }
    return null;
  }

  // ----- Check winner or tie -----
  function checkGameStatus() {
    const winCombo = getWinningCombo();
    if (winCombo) {
      winner = board[winCombo[0]];
      gameActive = false;
      return winner;
    }

    if (board.every(cell => cell !== null)) {
      winner = 'tie';
      gameActive = false;
      return 'tie';
    }

    winner = null;
    gameActive = true;
    return null;
  }

  // ----- Update status message -----
  function updateStatus() {
    if (winner === 'X') {
      statusElement.textContent = '🏆 X wins!';
    } else if (winner === 'O') {
      statusElement.textContent = '🏆 O wins!';
    } else if (winner === 'tie') {
      statusElement.textContent = '🤝 It\'s a tie!';
    } else {
      statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  // ----- Tile click handler -----
  function tileClickHandler(e) {
    const tile = e.currentTarget;
    const index = parseInt(tile.dataset.index, 10);

    if (!gameActive || winner || board[index] !== null) {
      return;
    }

    board[index] = currentPlayer;
    tile.textContent = currentPlayer;

    const result = checkGameStatus();

    if (result === 'X' || result === 'O') {
      renderBoard();
      return;
    } else if (result === 'tie') {
      renderBoard();
      return;
    }

    currentPlayer = (currentPlayer === 'X' ? 'O' : 'X');
    renderBoard();
  }

  // ----- Reset game -----
  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    winner = null;
    renderBoard();
  }

  // ----- Initialization -----
  function init() {
    renderBoard();
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', resetGame);
  }

  init();
})();