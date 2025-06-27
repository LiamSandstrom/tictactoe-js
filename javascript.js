const Player = function (newName, newId, newMarker) {
  const name = newName;
  const id = newId;
  const marker = newMarker;
  let score = 0;

  const getName = () => name;
  const getId = () => id;
  const getMarker = () => marker;
  const getScore = () => score;
  const incrementScore = function (){
    score++;
    DOMHeader.scoreAnimation();
  } 

  return { getName, getId, getMarker, getScore, incrementScore };
};

const gameFlow = (function () {
  const players = [];
  let inGame = true;
  let round = 1;
  let currentPlayer = null;

  const init = function () {
    const player1 = Player("bob", 1, "X");
    const player2 = Player("zoo", 2, "Y");

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
    inGame = true;
    round = 1;
    currentPlayer = players.at(0);
    board.populateCells();
    DOMboard.resetBoard();
    DOMHeader.endBtnAnim();
  };

  const flipInGame = function () {
    inGame = !inGame;
  };

  const win = function (winCells) {
    flipInGame();
    DOMHeader.setScores();
    DOMboard.addGameOverCellStyle();
    DOMboard.winAnimation(winCells);
    DOMHeader.startBtnAnim();
  };

  const getRound = () => round;
  const getCurrentPlayer = () => currentPlayer;
  const getInGame = () => inGame;
  const getPlayers = () => players;

  init();

  return {
    getRound,
    getCurrentPlayer,
    incrementRound,
    reset,
    flipInGame,
    getInGame,
    getPlayers,
    win,
  };
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
    const player = gameFlow.getCurrentPlayer();
    const index = cordsToIndex([row, column]);
    //const sign = idToSign(player.getId());
    const marker = player.getMarker();
    cells[index] = marker;
    console.log(cells);
    const winCells = checkWin([row, column]);
    if (winCells != null) {
      gameFlow.win(winCells);
      return;
    }
    gameFlow.incrementRound();
  };

  const validateArea = function ([row, column]) {
    if (
      row < 0 ||
      row > size - 1 ||
      column < 0 ||
      column > size - 1 ||
      row == null ||
      column == null
    ) {
      console.log("Enter Valid area please");
      return false;
    }
    const area = cells.at(cordsToIndex([row, column]));
    if (area != null) {
      console.log("Already filled by: " + area);
      return false;
    }
    return true;
  };

  const checkWin = function ([row, column]) {
    if (gameFlow.getRound() < size * 2 - 1) return;

    let winCells = [];
    console.log("CHECK WIN");

    const player = gameFlow.getCurrentPlayer();

    const checkVertical = function () {
      winCells = [];
      for (let i = 0; i < size; i++) {
        winCells.push(cordsToIndex([i, column]));
        if (cells.at(cordsToIndex([i, column])) != player.getMarker())
          return false;
      }
      return true;
    };

    const checkHorizontal = function () {
      winCells = [];
      for (let i = 0; i < size; i++) {
        winCells.push(cordsToIndex([row, i]));
        if (cells.at(cordsToIndex([row, i])) != player.getMarker())
          return false;
      }
      return true;
    };

    const checkDiagonal = function () {
      const rightDiagonal = () => {
        winCells = [];
        for (let i = 0; i < size * size; i += size + 1) {
          winCells.push(i);
          if (cells.at(i) != player.getMarker()) {
            return false;
          }
        }
        return true;
      };
      if (rightDiagonal()) return true;

      const leftDiagonal = () => {
        winCells = [];
        for (let i = size - 1; i <= size + size; i += 2) {
          winCells.push(i);
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
      return winCells;
    }
    return null;
  };

  const getSize = () => size;

  populateCells();

  return { markArea, populateCells, getSize, indexToCords, validateArea };
})();

const DOMboard = (function () {
  const container = document.querySelector(".container");
  const size = board.getSize();

  const createBoard = function () {
    for (let i = 0; i < size * size; i++) {
      createCell(i);
    }
  };

  const removeBoard = function () {
    while (container.firstChild != null) {
      container.removeChild(container.firstChild);
    }
  };

  const resetBoard = function () {
    removeBoard();
    createBoard();
  };

  const createCell = function (i) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    addClickEvent(div);
    addCellHoverEffect(div);

    container.appendChild(div);
  };

  const addClickEvent = function (div) {
    div.addEventListener("click", () => {
      addMarker(div);
    });
  };

  const addMarker = function (div) {
    if (gameFlow.getInGame() == false) return false;
    const cords = board.indexToCords(div.dataset.index);
    if (board.validateArea(cords) == false) return;

    removeCellHoverEffect(div);
    const currentPlayer = gameFlow.getCurrentPlayer();
    div.textContent = currentPlayer.getMarker();
    board.markArea(cords);

    div.classList.add(currentPlayer.getId() == 1 ? "x" : "y");
    div.style.color = currentPlayer.getId() == 1 ? "black" : "white";
    console.log("MARK");
  };

  const addGameOverCellStyle = function () {
    for (child of container.children) {
      child.classList.add("gameOverCell");
      removeCellHoverEffect(child);
    }
  };

  const winAnimation = function (cells) {
    //WARNING DIRTY CODE BUT IT WORKS

    for (child of container.children) {
      child.style.transform = "scale(0.9)";
    }

    const anim = [
      { transform: "scale(0.9)", offset: 0.0 },
      { outline: "3px solid orange", offset: 0.2 },
      { transform: "scale(1.0)", offset: 0.3 },
      { transform: "rotate(7deg)", offset: 0.5 },
      { outline: "3px solid blue", offset: 0.6 },
      { transform: "rotate(-7deg)", offset: 0.7 },
      { outline: "3px solid cyan", offset: 0.75 },
      { transform: "rotate(7deg)", offset: 0.9 },
      { transform: "rotate(0deg)", offset: 1.0 },
      { color: "gold", offset: 1.0 },
      { outline: "3px solid orange", offset: 1.0 },
    ];

    const animTiming = {
      duration: 380,
      fill: "forwards",
    };

    setTimeout(() => {
      cells.forEach((index, i) => {
        const cell = container.children[index];
        setTimeout(() => {
          console.log("win! " + index);
          cell.animate(anim, animTiming);
          setTimeout(() => {
            cell.animate(
              [
                { transform: "scale(1.0)" },
                { transform: "scale(0.95)" },
                { transform: "scale(1.0)" },
                { transform: "scale(0.95)" },
                { transform: "scale(1.0)" },
              ],
              { duration: 3420, fill: "forwards" }
            );
          }, 580);
          setInterval(() => {
            cell.animate(
              [
                { transform: "scale(1.0)" },
                { transform: "scale(0.94)" },
                { transform: "scale(1.0)" },
              ],
              { duration: 300, fill: "forwards" }
            );
            setTimeout(() => {
              cell.animate(
                [
                  { transform: "scale(1.0)" },
                  { transform: "scale(0.96)" },
                  { transform: "scale(1.0)" },
                  { transform: "scale(0.96)" },
                  { transform: "scale(1.0)" },
                ],
                { duration: 3620, fill: "forwards" }
              );
            }, 300);
          }, 4000);
        }, 400 * i);
      });
    }, 700);
  };

  const addCellHoverEffect = function (div) {
    div._onHover = () => onHover(div);
    div._onHoverLeave = () => onHoverLeave(div);

    div.addEventListener("mouseover", div._onHover);
    div.addEventListener("mouseleave", div._onHoverLeave);
  };

  const removeCellHoverEffect = function (div) {
    div.removeEventListener("mouseover", div._onHover);
    div.removeEventListener("mouseleave", div._onHoverLeave);
    const style = (div.style.color = window.getComputedStyle(document.body));
    if (div.classList.contains("x")) {
      div.style.color = style.getPropertyValue("--x-text-color");
    } else {
      div.style.color = style.getPropertyValue("--y-text-color");
    }
  };
  const onHover = function (div) {
    div.style.color = "grey";
    div.textContent = gameFlow.getCurrentPlayer().getMarker();
  };
  const onHoverLeave = function (div) {
    div.textContent = "";
  };

  createBoard();
  return { resetBoard, addGameOverCellStyle, winAnimation };
})();

const DOMHeader = (function () {
  const p1Name = document.querySelector(".p1-name");
  const p2Name = document.querySelector(".p2-name");

  const p1Score = document.querySelector(".p1-score");
  const p2Score = document.querySelector(".p2-score");

  const resetBtn = document.querySelector("#reset-btn");
  let animRef;

  const setScores = function () {
    p1Score.textContent = gameFlow.getPlayers().at(0).getScore();
    p2Score.textContent = gameFlow.getPlayers().at(1).getScore();
  };

  const setResetBtn = function () {
    resetBtn.addEventListener("click", () => {
      gameFlow.reset();
    });
  };

  const startBtnAnim = function () {
    if (animRef) return;
    animRef = setInterval(resetBtnAnimation, 5000);
  };

  const endBtnAnim = function () {
    clearInterval(animRef);
    animRef = null;
  };

  const resetBtnAnimation = function () {
    const anim = [
      { transform: "rotate(0)", offset: 0.0 },
      { transform: "rotate(-5deg)", offset: 0.2 },
      { transform: "rotate(5deg)", offset: 0.4 },
      { transform: "rotate(-5deg)", offset: 0.6 },
      { transform: "rotate(5deg)", offset: 0.8 },
      { transform: "rotate(0deg)", offset: 1 },
    ];
    const animRules = {
      duration: 300,
      fill: "forwards",
    };

    resetBtn.animate(anim, animRules);
  };

  const scoreAnimation = function () {
    const id = gameFlow.getCurrentPlayer().getId();
    const target = id == 1 ? p1Score : p2Score;
    console.log("TAR: " + target)

    const anim = [
      { transform: "scale(1)", offset: 0.0 },
      { transform: "scale(1.5)", offset: 0.5 },
      { color: "lime", offset: 0.5 },
      { transform: "scale(1.5)", offset: 0.7 },
      { color: "lime", offset: 0.7 },
      { transform: "scale(1)", offset: 1 },
    ];
    const animRules = {
      duration: 300,
      fill: "forwards",
    };

    target.animate(anim, animRules);
  };

  setScores();
  setResetBtn();

  return { setScores, startBtnAnim, endBtnAnim, scoreAnimation };
})();


const introAnim = (function (){
    const body = document.body;

    const anim = [
      { opacity: "0", offset: 0.0 },
      { opacity: "1", offset: 1.0 },
    ];

    const animRules = {
      duration: 1000,
      fill: "forwards",
    };
    body.animate(anim, animRules)
})();
//TODO:
//header load animation
//board load animation?!
