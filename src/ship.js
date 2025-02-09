import { updateShipDisplay } from "./display";

const shipTypes = {
  Destroyer: 2,
  Submarine: 3,
  Cruiser: 3,
  Battleship: 4,
  Carrier: 5,
};

const createShip = (shipType) => {
  return {
    shipType,
    length: shipTypes[shipType],
    hits: 0,
    hit() {
      this.hits++;
    },
    isSunk() {
      return this.hits >= this.length;
    },
  };
};

function randomizeShips(player) {
  let board = clearShips(player.board);
  console.log("Board after clearing ships:", board);
  const boardSize = 10;

  const shipSupply = [];
  shipSupply.push(createShip("Destroyer"));
  shipSupply.push(createShip("Submarine"));
  shipSupply.push(createShip("Cruiser"));
  shipSupply.push(createShip("Battleship"));
  shipSupply.push(createShip("Carrier"));

  shipSupply.forEach((ship) => {
    let placed = false;

    while (!placed) {
      const isHorizontal = Math.random() < 0.5;
      let randomX, randomY;

      if (isHorizontal) {
        randomX = Math.floor(Math.random() * (boardSize - ship.length + 1));
        randomY = Math.floor(Math.random() * boardSize);
      } else {
        randomX = Math.floor(Math.random() * boardSize);
        randomY = Math.floor(Math.random() * (boardSize - ship.length + 1));
      }

      try {
        board.placeShip(ship, randomX, randomY, isHorizontal);
        placed = true;
      } catch (error) {
  
      }
    }
  });
  updateShipDisplay(player);
  return board;
}

function clearShips(board) {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      let cell = board.getCell(x, y);
      if (cell.shipData) {
        const cellElement = document.querySelector(
          `.board-cell[data-coords="${x},${y}"]`,
        );
        cellElement.classList.remove("ship", 'ship-strawhats');
        cell.shipData = null;
      }
    }
  }
  board.setShips([]);
  return board;
};

export { createShip, randomizeShips, clearShips };
