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

  const getSize = () => size;

  populateCells();

  return { markArea, populateCells, getSize, indexToCords };
})();

const DOMboard = (function () {
  const container = document.querySelector(".container");
  const size = board.getSize();

  const createBoard = function () {
    for (let i = 0; i < size * size; i++) {
      createCell(i);
    }
  };

  const createCell = function (i) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    addClickEvent(div);

    container.appendChild(div);
  };

  const addClickEvent = function (div) {
    div.addEventListener("click", () => {
      addMarker(div);
      board.markArea(board.indexToCords(div.dataset.index));
    });
  };

  const addMarker = function (div) {
    if(div.textContent != "") return;
    div.textContent = gameFlow.getCurrentPlayer().getMarker();
    div.classList.add("filled")
    console.log("MARK");
  };

  createBoard();
})();
