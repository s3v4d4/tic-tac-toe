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

    const getValue = function (x,y){
      return board[x][y];
    }

    reset();

    return {board,reset,fillValue,getValue};
  })();

// Object that will control the game

const Game = (function () {
  const gameboard = Gameboard;
  const player1 = createPlayer("Player 1","X",true);
  const player2 = createPlayer("Player 2","O",false);

  const players = [player1,player2];

  const displayBoard = function (){
    const boxes = document.querySelectorAll('.child');
    for (let i = 0; i < gameboard.board.length;i++){
      for(let j = 0; j < gameboard.board[i].length;j++){
        if (gameboard.board[i][j] != null){
          boxes[i*gameboard.board[i].length+j].innerHTML = gameboard.board[i][j];
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
          if (gameboard.getValue(x,y) === null) {gameboard.fillValue(x,y,player.symbol);}
        }
      }
      changeTurns();
      displayBoard();
      
      let win = checkWin();
      let tie = checkTie();
      console.log(win);
      if (win === true){
        console.log("You won the game!");
      }else if (tie == true){
        console.log("This game is a tie!");
      }
    })

    const checkTie = function (){
      let flatArray = gameboard.board.flat();
      return !flatArray.includes(null);
    }

    const checkWin = function (){
      // Define separate functions that check each individual possiblity
      
      const checkRows= function (){
        let win = false;
        // Check whether each row or subarray contains the same elements 
        for (row of gameboard.board){
          win = win || row.every((val,i,arr) => val === arr[0] && arr[0] != null);
        }
        return win;
      }

      const checkColumns = function (){
        let win = false;
        for(let i = 0;i<gameboard.board.length;i++){
          // Select all the i'th elements in the subarray to form the column
          let column = gameboard.board.map(function(value,index) { return value[i]; })
          win = win || column.every((val,i,arr) => val === arr[0] && arr[0] != null);
        }
        return win;
      }

      const checkDiagonals = function (){
        let win = false; 
        let diagonal1 = [];
        let diagonal2 = [];
        let len = gameboard.board.length;
        for (let i = 0; i < len;i++){
          diagonal1.push(gameboard.board[i][i]);
          diagonal2.push(gameboard.board[len-i-1][i]);
        }
        win = diagonal1.every((val,i,arr) => val === arr[0] && arr[0] != null) 
              || diagonal2.every((val,i,arr) => val === arr[0] && arr[0] != null);
        return win;
      }

      return checkColumns() || checkRows() || checkDiagonals();
    }
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