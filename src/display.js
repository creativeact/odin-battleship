import { clearShips } from './ship';

// Boards //
function createEmptyBoard(player, game) {
  const boardsDiv = document.querySelector('#boards');

  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');

  const playerBoard = document.createElement("div");
  playerBoard.classList.add("player-board");
  playerBoard.setAttribute('id', `${player.name}`)
  const board = player.board;
 

  let rows = 10;
  let columns = 10;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let newCell = createCell(board, game, i, j);
      playerBoard.appendChild(newCell);
    }
  }
  boardContainer.appendChild(playerBoard);
  boardsDiv.appendChild(boardContainer);
}

function resetBoard (player) {
  let board = clearShips(player.board);
  const playerBoard = document.querySelector(`#${player.name}`);
  if (playerBoard) {
    const boardContainer = playerBoard.closest('.board-container');
    if (boardContainer) {
      boardContainer.remove();
    }
  }

  // Update shipcount on reset
  const name = player.name;
  const playerString = name === 'Strawhats' ? "player1" : "player2";
  displayShipCount(player, playerString);
  return board;
}

// Cells //
function createCell(board, game, x, y) {
  const boardCell = document.createElement("div");
  boardCell.classList.add("board-cell");
  boardCell.setAttribute("data-coords", `${x},${y}`);
  cellClickHandler(boardCell, board, game, x, y);
  return boardCell;
}

const cellClickHandler = (target, board, game, x, y) =>
  target.addEventListener("click", () => {
    const { gameOver, defendingPlayer } = game.getGameState();

    if (gameOver) return;
    if (defendingPlayer.board !== board) return;

    game.handleTurn(x, y);

    const cell = board.getCell(x, y);
    displayAttackResult(target, cell);
  });

function displayAttackResult(target, cell) {
  if (cell.miss === true) {
    target.classList.add("miss");
  }
  if (cell.hit === true) {
    target.classList.remove("ship");
    target.classList.add("hit");
  }
}

function getDOMCellElement(board, cell) {
  const x = cell.xCoord;
  const y = cell.yCoord;
  const cellElement = document.querySelector(
    `.board-cell[data-coords="${x},${y}"]`,
  );
  return cellElement;
}

// Player Display & Modals //

function updateShipDisplay(player) {
  const board = player.board;
  const playerBoard = document.querySelector(`#${player.name}`);
  
  let rows = 10;
  let columns = 10;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const cell = board.getCell(x, y);
      const cellElement = playerBoard.querySelector(
        `.board-cell[data-coords="${x},${y}"]`,
      );
      if (cell.shipData !== null) {
        cellElement.classList.add("ship");
        if (player.playerType === 'human') {
          cellElement.classList.add('ship-strawhats');
        }
        else if (player.playerType === 'computer') {
          cellElement.classList.add('ship-marines');
        }
      }
      else if (cell.shipData === null) {
        cellElement.classList.remove('ship');
        if (player.playerType === 'human') {
          cellElement.classList.remove('ship-strawhats');
        }
      }
    }
  }
}

function displayWinner(player) {
  const winner = player.name;
  const gameEndAnnouncement = document.querySelector("#game-end-announcement");
  gameEndAnnouncement.textContent = `${winner} win!`;
  toggleHideElement('.modal-overlay');
}

function displayShipCount(player, playerString) {
  const shipCountSpan = document.querySelector(`#${playerString}-ship-count`);
  const shipCount = player.board.getShips();
  shipCountSpan.textContent = '';
  shipCountSpan.textContent = `${shipCount}`;
}

function toggleHideElement(element) {
  const target = document.querySelector(element);
  if (target) {
    target.classList.toggle('hidden');
  }
  else {
    console.error(`Element "${element}" not found.`);
  }
}

export { createEmptyBoard, resetBoard, displayAttackResult, displayWinner, updateShipDisplay, getDOMCellElement, displayShipCount, toggleHideElement, clearShips };
