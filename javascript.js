const Player = function (newName, newId, newMarker) {
  const name = newName;
  const id = newId;
  const marker = newMarker;
  const score = 0;

  const getName = () => name;
  const getId = () => id;
  const getMarker = () => marker;
  const getScore = () => score;
  const incrementScore = () => score++;

  return { getName, getId, getMarker, getScore, incrementScore };
};

const gameFlow = (function () {
  const players = [];
  const round = 0;

  const init = function () {
    const player1 = Player("bob", players.length + 1, "X");
    const player2 = Player("zoo", players.length + 1, "Y");
  };

  const incrementRound = function () {};

  const getRound = () => round;

  init();

  return { getRound };
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

  const markArea = function (player, [row, column]) {
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
    checkWin();
  };

  const checkWin = function ([row, column], player) {
    if (gameFlow.getRound < size * 2 - 1) return;

    const checkVertical = function () {
      for (let i = 0; i < size; i++) {
        if (cells.at(cordsToIndex([i, column])) != player.getMarker()) return false;
      }
      return true;
    };

    const checkHorizontal = function(){
        for(let i = 0; i < size; i++){
        if (cells.at(cordsToIndex([row, i])) != player.getMarker()) return false;
        }
        return true;
    }

    if(checkVertical() == true || checkDiagonal() == true || checkHorizontal() == true) return true;
    return false;
  };
  
  const checkDiagonal = function(){
    for(let i = 0; i < size * size; i += (size + 1)){
        if(cells.at(i)){

        }
    }
  }

  populateCells();
  return { markArea };
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
