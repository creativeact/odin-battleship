import { Ship, Gameboard, Cell } from "./index";

// Ship Object Tests
describe("Ship Object functionality", () => {
  let newShip;

  beforeAll(() => {
    newShip = Ship("Destroyer");
  });

  test("Ship initializes with correct properties", () => {
    let newShip = Ship("Destroyer");
    expect(newShip.shipType).toBe("Destroyer");
    expect(newShip.length).toBe(2);
    expect(newShip.hits).toBe(0);
    expect(newShip.isSunk()).toBe(false);
  });

  test("Ship isSunk works", () => {
    expect(newShip.isSunk()).toBe(false);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
  });
});

// Gameboard Tests
describe("Gameboard tests", () => {
  let board;
  let mockShip;
  let mockShip2;

  beforeEach(() => {
    board = Gameboard();
    mockShip = {
      shipType: "Carrier",
      length: 5,
      hits: 0,
      hit() {
        this.hits++;
      },
      isSunk() {
        return this.hits >= this.length;
      },
    };
    board.placeShip(mockShip, 0, 0, false);

    mockShip2 = {
      shipType: "Carrier",
      length: 5,
      hits: 0,
      hit() {
        this.hits++;
      },
      isSunk() {
        return this.hits >= this.length;
      },
    };
  });

  test("Ship is placed properly: happy path", () => {
    expect(board.board[0][0].shipData).toBe(mockShip);
    expect(board.board[0][0].hit).toBe(false);
    expect(board.board[0][0].miss).toBe(false);
    expect(board.board[0][0].xCoord).toBe(0);
    expect(board.board[0][0].yCoord).toBe(0);
  });

  test("Ship is placed over other ship", () => {
    expect(() => board.placeShip(mockShip2, 0, 0, false)).toThrow(
      "Invalid ship placement",
    );
  });

  test("Ship is placed out of bounds", () => {
    expect(() => board.placeShip(mockShip2, 9, 0, true)).toThrow(
      "Invalid ship placement",
    );
  });

  describe("Sinking a ship", () => {
    test("Sink one ship properly", () => {
      for (let i = 0; i < mockShip.length; i++) {
        board.receiveAttack(0, i);
      }
      expect(mockShip.hits).toBe(5);
      expect(mockShip.isSunk()).toBe(true);
    });
  });

  describe("Receive Attack function", () => {
    test("Ship receives attack", () => {
      board.receiveAttack(0, 0);
      expect(mockShip.hits).toBe(1);
    });

    test("Missed attack marks the board", () => {
      board.receiveAttack(5, 5);
      expect(board.board[5][5].miss).toBe(true);
    });

    test("Cannot attack the same cell twice", () => {
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 0);
      expect(mockShip.hits).toBe(1);
    });
  });
});
