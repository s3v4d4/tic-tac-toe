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

  const findBestMove = function(){
    let scores = [];
    for (const legalMove of legalMoves(gameboard.board)){
      // Create new state by making every legal move of computer
      gameboard.fillValue(legalMove[0],legalMove[1],player2.symbol);
      // Computer did the move so now it's player's turn we should maximize
      scores.push(minimax(gameboard,true));
      // reset to old state by changing legal move into null
      gameboard.fillValue(legalMove[0],legalMove[1],null);
    }
    // Computer's turn so should be minimized
    let i = scores.indexOf(Math.min(...scores));
    let bestMove = legalMoves(gameboard.board)[i];
    gameboard.board[bestMove[0]][bestMove[1]] = player2.symbol;
  }

  const minimax = function (gameboard,maximizingPlayer){
    if (calcScore(gameboard.board) != null) return calcScore(gameboard.board);
    
    if (maximizingPlayer){
      let score = -2;
      let legMoves = legalMoves(gameboard.board);
      for (const legalMove of legMoves){
        gameboard.fillValue(legalMove[0],legalMove[1],player1.symbol);
        score = Math.max(score,minimax(gameboard,false));
        gameboard.fillValue(legalMove[0],legalMove[1],null);
      }
      return score;
    }else{
      let score = 2;
      let legMoves = legalMoves(gameboard.board);
      for (const legalMove of legMoves){
        gameboard.fillValue(legalMove[0],legalMove[1],player2.symbol);
        score = Math.min(score,minimax(gameboard,true));
        gameboard.fillValue(legalMove[0],legalMove[1],null);
      }
      return score;
    }
  }

  const calcScore = function (state){
    if (checkWin(state,player1.symbol)) return 1;
    else if (checkWin(state,player2.symbol)) return -1;
    else if (checkTie(state)) return 0;
    else return null;
  }

  const legalMoves = function (array){
    moves = [];
    for (let i=0;i<array.length;i++){
      for (let j=0;j<array[i].length;j++){
        if (array[i][j] === null) moves.push([i,j]);
      }
    }
    return moves;
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

      
      displayBoard();
      checkWinner(gameboard,players);
      changeTurns();
      findBestMove();
      displayBoard();
      checkWinner(gameboard,players);
      changeTurns();
    })
  })

  const checkWinner = function(gameboard,players){
    let player1win = checkWin(gameboard.board,players[0].symbol);
    let player2win = checkWin(gameboard.board,players[1].symbol);

    let tie = checkTie(gameboard.board);

    if (player1win){
      console.log("Player 1 won the game!");
    }else if (tie){
      console.log("This game is a tie!");
    }else if (player2win){
      console.log("Player 2 won the game!")
    }

  }
  
  const checkTie = function (array){
    let flatArray = array.flat();
    return !flatArray.includes(null);
  }

  const checkWin = function (array,symbol){
    // Define separate functions that check each individual possiblity
    
    const checkRows= function (){
      let win = false;
      // Check whether each row or subarray contains the same elements 
      for (row of array){
        win = win || row.every((val,i,arr) => val === symbol && arr[0] != null);
      }
      return win;
    }

    const checkColumns = function (){
      let win = false;
      for(let i = 0;i<array.length;i++){
        // Select all the i'th elements in the subarray to form the column
        let column = array.map(function(value,index) { return value[i]; })
        win = win || column.every((val,i,arr) => val === symbol && arr[0] != null);
      }
      return win;
    }

    const checkDiagonals = function (){
      let win = false; 
      let diagonal1 = [];
      let diagonal2 = [];
      let len = array.length;
      for (let i = 0; i < len;i++){
        diagonal1.push(array[i][i]);
        diagonal2.push(array[len-i-1][i]);
      }
      win = diagonal1.every((val,i,arr) => val === symbol && arr[0] != null) 
            || diagonal2.every((val,i,arr) => val === symbol && arr[0] != null);
      return win;
    }

    return checkColumns() || checkRows() || checkDiagonals();
  }
  

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