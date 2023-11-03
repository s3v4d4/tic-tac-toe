// Object that will contain the gameboard
const Gameboard = (function () {
    const board = [];
    
    const reset = function () {
      for (i=0;i<3;i++){
        board.push(new Array(3).fill(null));    
      }
    }

    const fillValue = function (x,y,value) {
      board[x][y] = value;
    }

    reset();

    return {board,reset,fillValue};
  })();

// Object that will control the game

const Game = (function () {
  const gameboard = Gameboard;
  const player1 = createPlayer("Player 1","X",true);
  const player2 = createPlayer("Player 2","O",false);

  const players = [player1,player2];

  gameboard.board[1][1] = 'O';

  const displayBoard = function (){
    const boxes = document.querySelectorAll('.child');
    for (let i = 0; i < gameboard.board.length;i++){
      for(let j = 0; j < gameboard.board[i].length;j++){
        if (gameboard.board[i][j] != null){
          boxes[i*gameboard.board[i].length+j].innerHTML = gameboard.board[i][j];
          console.log(gameboard.board[i][j]);
        }
      }
    }
  }

  const changeTurns = () => {
    player1.changeTurn();
    player2.changeTurn();
  }

  // Add an event listener to the mouse clicks on the screen

  const boxes = document.querySelectorAll('.child');
  boxes.forEach(box => {
    box.addEventListener('click', (e) => {
      // find on which box the player clicked by finding out 
      // which child of the parent emitted the event
      let parent = box.parentNode;
      let index = Array.prototype.indexOf.call(parent.children,box);
      for (player of players){
        if (player.isTurn()){
          let x = Math.floor(index/3);
          let y = index % 3;
          gameboard.fillValue(x,y,player.symbol);
        }
      }
      changeTurns();
      displayBoard();
    })
  })

  return {gameboard,displayBoard,players};
})()

// Factory function that will create player

function createPlayer(name,symbol,firstMove){
  let score = 0;
  let myTurn = firstMove;

  const changeTurn = () => {myTurn = !myTurn};

  const isTurn = () => myTurn;

  const getScore = () => score;
  const increaseScore = () => score++;

  return {name,symbol,getScore,increaseScore,changeTurn,isTurn};
}

console.log(Gameboard);

Game.displayBoard();