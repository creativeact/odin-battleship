import {
  createEmptyBoard,
  resetBoard,
  displayAttackResult,
  getDOMCellElement,
  displayShipCount,
  displayWinner,
  toggleHideElement,
} from "./display";
import { randomizeShips } from "./ship";
import { Player } from "./factory";

const gameController = (player1, player2) => {
  let attackingPlayer = player1;
  let defendingPlayer = player2;
  let gameReady = false;
  let gameOver = false;
  let winner = null;

  const switchPlayer = () => {
    if (gameOver) return;
    [attackingPlayer, defendingPlayer] = [defendingPlayer, attackingPlayer];
  };

  const handleTurn = (x, y) => {
    if (!gameReady) {
      return;
    }
    if (gameOver) return "gameover";

    const attackResult = defendingPlayer.board.receiveAttack(x, y);

    // String needed to align with querySelector for each player's ship-count div
    const defendingPlayerString =
      defendingPlayer === player1 ? "player1" : "player2";

    if (attackResult === "gameover") {
      gameOver = true;
      winner = attackingPlayer;
      displayShipCount(defendingPlayer, defendingPlayerString);
      displayWinner(winner);
    } else if (attackResult !== "invalid") {
      displayShipCount(defendingPlayer, defendingPlayerString);
      switchPlayer();
      if (attackingPlayer.playerType === "computer") computerTurn();
    }
    return attackResult;
  };

  const computerTurn = () => {
    const target = defendingPlayer.board;
    setTimeout(() => {
      const { x, y } = randomizeAttack(target);
      handleTurn(x, y);
      const cell = target.getCell(x, y);
      const cellDOM = getDOMCellElement(target, cell);
      displayAttackResult(cellDOM, cell);
    }, 300);
  };

  const getGameState = () => ({
    gameReady,
    attackingPlayer,
    defendingPlayer,
    gameOver,
    winner,
  });

  const setupEventListeners = (player1) => {
    const board = player1.board;
    const randomizeShipsBtn = document.querySelector(".randomize-ships");
    const startGameBtn = document.querySelector(".start-game");
    const resetGameBtn = document.querySelector(".reset-game");
    const playAgainBtn = document.querySelector(".play-again");

    randomizeShipsBtn.replaceWith(randomizeShipsBtn.cloneNode(true));
    startGameBtn.replaceWith(startGameBtn.cloneNode(true));
    resetGameBtn.replaceWith(resetGameBtn.cloneNode(true));
    playAgainBtn.replaceWith(playAgainBtn.cloneNode(true));

    const newRandomizeShipsBtn = document.querySelector(".randomize-ships");
    const newStartGameBtn = document.querySelector(".start-game");
    const newResetGameBtn = document.querySelector(".reset-game");
    const newPlayAgainBtn = document.querySelector(".play-again");

    newRandomizeShipsBtn.addEventListener("click", () => {
      if (!board.getBoardReady() && gameReady === false) {
        randomizeShips(player1);
        board.setBoardReady();
        toggleHideElement(".start-game");
      } else if (gameReady === false) {
        randomizeShips(player1);
      } else console.error("Ship placement error");
    });

    newStartGameBtn.addEventListener("click", () => {
      if (board.getBoardReady() && gameReady === false) {
        gameReady = true;
        console.log("Validating that Game is ready: ", gameReady);
        toggleHideElement(".start-game");
        toggleHideElement(".randomize-ships");
        toggleHideElement(".reset-game");
      }
    });

    newResetGameBtn.addEventListener("click", () => {
      if (gameReady === true) {
        player1.board = resetBoard(player1);
        player2.board = resetBoard(player2);
        initializeGame();
        gameReady = false;
        toggleHideElement(".reset-game");
        toggleHideElement(".randomize-ships");
      }
    });

    newPlayAgainBtn.addEventListener("click", () => {
      if (gameReady === true) {
        player1.board = resetBoard(player1);
        player2.board = resetBoard(player2);
        initializeGame();
        gameReady = false;
        toggleHideElement(".reset-game");
        toggleHideElement(".randomize-ships");
        toggleHideElement(".modal-overlay");
      }
    });
  };

  return { switchPlayer, handleTurn, getGameState, setupEventListeners };
};

function randomizeAttack(board) {
  let x, y;
  let validAttack = false;

  while (!validAttack) {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);

    const cell = board.getCell(x, y);

    if (!cell.hit && !cell.miss) {
      validAttack = true;
    }
  }
  return { x, y };
}

const initializeGame = () => {
  const player1 = Player("Strawhats");
  const player2 = Player("Marines", "computer");
  const game = gameController(player1, player2);
  createEmptyBoard(player1, game);
  createEmptyBoard(player2, game);
  randomizeShips(player2);
  game.setupEventListeners(player1);
};

export { initializeGame };
