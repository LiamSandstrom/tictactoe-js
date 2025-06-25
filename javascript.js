const Player = function (newName, newId, newMarker) {
  const name = newName;
  const id = newId;
  const marker = newMarker;
  let score = 0;

  const getName = () => name;
  const getId = () => id;
  const getMarker = () => marker;
  const getScore = () => score;
  const incrementScore = () => score++;

  return { getName, getId, getMarker, getScore, incrementScore };
};

const gameFlow = (function () {
  const players = [];
  let round = 1;
  let currentPlayer = null;

  const init = function () {
    const player1 = Player("bob", players.length + 1, "X");
    const player2 = Player("zoo", players.length + 1, "Y");

    players.push(player1);
    players.push(player2);
    currentPlayer = player1;
  };

  const incrementRound = function () {
    round++;
    if (currentPlayer == players.at(0)) {
      currentPlayer = players.at(1);
    } else {
      currentPlayer = players.at(0);
    }
  };

  const reset = function () {
    round = 1;
    currentPlayer = players.at(0);
    board.populateCells();
  };

  const getRound = () => round;
  const getCurrentPlayer = () => currentPlayer;

  init();

  return { getRound, getCurrentPlayer, incrementRound, reset };
})();

const board = (function () {
  const size = 3;
  const cells = [];

  const populateCells = function () {
    for (let i = 0; i < size * size; i++) {
      cells[i] = null;
    }
    console.log(cells);
  };

  const indexToCords = function (index) {
    const row = Math.floor(index / size);
    const column = index % size;
    return [row, column];
  };

  const cordsToIndex = function ([row, column]) {
    return row * size + column;
  };

  const markArea = function ([row, column]) {
    if (
      row < 0 ||
      row > size - 1 ||
      column < 0 ||
      column > size - 1 ||
      row == null ||
      column == null
    ) {
      console.log("Enter Valid area please");
      return;
    }
    const player = gameFlow.getCurrentPlayer();
    const index = cordsToIndex([row, column]);
    const area = cells.at(index);
    if (area != null) {
      console.log("Already filled by: " + area);
      return;
    }
    //const sign = idToSign(player.getId());
    const marker = player.getMarker();
    cells[index] = marker;
    console.log(cells);
    if (checkWin([row, column])) {
      return;
    }
    gameFlow.incrementRound();
  };

  const checkWin = function ([row, column]) {
    if (gameFlow.getRound() < size * 2 - 1) return;

    console.log("CHECK WIN");

    const player = gameFlow.getCurrentPlayer();

    const checkVertical = function () {
      for (let i = 0; i < size; i++) {
        if (cells.at(cordsToIndex([i, column])) != player.getMarker())
          return false;
      }
      return true;
    };

    const checkHorizontal = function () {
      for (let i = 0; i < size; i++) {
        if (cells.at(cordsToIndex([row, i])) != player.getMarker())
          return false;
      }
      return true;
    };

    const checkDiagonal = function () {
      const rightDiagonal = () => {
        for (let i = 0; i < size * size; i += size + 1) {
          if (cells.at(i) != player.getMarker()) {
            return false;
          }
        }
        return true;
      };
      if (rightDiagonal()) return true;

      const leftDiagonal = () => {
        for (let i = size - 1; i <= size + size; i += 2) {
          if (cells.at(i) != player.getMarker()) {
            return false;
          }
        }
        return true;
      };

      if (leftDiagonal()) return true;
    };

    if (
      checkVertical() == true ||
      checkDiagonal() == true ||
      checkHorizontal() == true
    ) {
      console.log("WINNER: " + gameFlow.getCurrentPlayer().getName());
      gameFlow.getCurrentPlayer().incrementScore();
      return true;
    }
    return false;
  };

  populateCells();

  return { markArea, populateCells };
})();

//board module
/*
define size 
pop board (cells in array)
put marker(check if availabe, 
when put markers > size check if win?)
 */

//player factory
/*
name 
sign?

 */

//Obj flow?
//start game?
//player turn?
//players
