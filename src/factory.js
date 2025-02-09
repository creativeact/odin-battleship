import { createShip } from "./ship.js";

const Gameboard = () => {
  const rows = 10;
  const columns = 10;
  let board = [];
  let ships = [];
  let boardReady = false;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell(i, j));
    }
  }

  const placeShip = (ship, startX, startY, isHorizontal) => {
    let potentialCells = [];

    for (let i = 0; i < ship.length; i++) {
      const x = isHorizontal ? startX : startX + i;
      const y = isHorizontal ? startY + i : startY;
      if (x < 0 || x >= rows || y < 0 || y >= columns || board[x][y].shipData) {
        throw new Error("Invalid ship placement");
      }
      potentialCells.push(board[x][y]);
    }
    potentialCells.forEach((cell) => {
      cell.shipData = ship;
    });
    ships.push(ship);
  };

  const receiveAttack = (x, y) => {
    let targetCell = board[x][y];

    if (targetCell.hit || targetCell.miss) {
      console.log("Cell already selected");
      return "invalid";
    }

    if (targetCell.shipData === null) {
      targetCell.miss = true;
      return "miss";
    } else {
      const ship = targetCell.shipData;
      ship.hit();
      targetCell.hit = true;

      if (ship.isSunk() && allShipsSunk()) {
        return "gameover";
      }
      return "hit";
    }
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  const getBoardReady = () => {
     return boardReady;
  }

  const setBoardReady = () => {
    boardReady = true;
  }

  const getCell = (x, y) => {
    return board[x][y];
  };

  const getBoard = () => {
    return board;
  };

  const getShips = () => {
    let shipCount = 17;
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        const cell = getCell(x, y);
        if (cell.shipData && cell.hit) {
          shipCount--;
        }
      }
    }
    return shipCount;
  };

  const setShips = (newShips) => {
    ships = newShips;
  }

  return { getBoard, getShips, setShips, placeShip, receiveAttack, getCell, allShipsSunk, getBoardReady, setBoardReady };
};

const Cell = (xCoord, yCoord) => {
  return {
    shipData: null,
    hit: false,
    miss: false,
    xCoord: xCoord,
    yCoord: yCoord,
  };
};

const Player = (name, playerType = "human") => {
  return {
    name: name,
    playerType,
    board: Gameboard(),

  };
};

export { createShip, Gameboard, Player };
