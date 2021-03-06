var origBoard;
const huPlayer="O";
const aiplayer="X";
const winCombos=[
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]

];

const cells= document.querySelectorAll('.cell');
startGame();

function startGame(){
	document.querySelector(".endgame").style.display="none";
	origBoard=Array.from(Array(9).keys()) ;
    for(var i=0;i< cells.length;i++){
    	cells[i].innerText=" ";
    	cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false);
    }
}

    function turnClick(square){
    	if(typeof origBoard[square.target.id]  == 'number'){
    	turn(square.target.id,huPlayer);
    	if(!checkTie()) turn(bestspot(),aiplayer);
    }
    }
    function turn(squareid,player){
    	origBoard[squareid]= player;
    	document.getElementById(squareid).innerText= player;
    	let gameWon=checkWin(origBoard,player)
    	if(gameWon)  gameOver(gameWon) 
    }
    
    function checkWin(board,player){
    	let plays= board.reduce((a,e,i) => (e===player)? a.concat(i) :a,[]);
    	let gameWon=null;
        for( let [index,win] of winCombos.entries()) {
        	if(win.every(elem => plays.indexOf(elem)>-1)) {
        		gameWon={ index: index, player: player };
        		break;
        	}
        }
        return gameWon;


    }

    function gameOver(gameWon){
        
        for(let index of winCombos[gameWon.index]){
        	document.getElementById(index).style.backgroundColor= (gameWon.player==huPlayer)?'green':'red';

        }
        //
        for(var i=0;i<cells.length;i++){
        	cells[i].removeEventListener('click',turnClick,false);
        }
        declareWinner(gameWon.player == huPlayer ? "You Won" : "The AI won");

    }
    //declares the winner of the game
    function declareWinner(who){
          document.querySelector('.endgame').style.display='block';
          document.querySelector('.endgame .text').innerText= who;

    }
    //checks the number of empty squares
    function emptysquares(){
    	return origBoard.filter(s => typeof s == 'number');
    }
    //returns the best spot(index) for AI
    function bestspot(){
    	return minimax(origBoard,aiplayer).index ;
    }
    //checks for a tie
    function checkTie(){
    	if(emptysquares().length === 0) {
    		for(var i=0;i<cells.length;i++){
    			cells[i].style.backgroundColor='green';
    			cells[i].removeEventListener('click',turnClick,false);
    		}
    		declareWinner('Tie game')
    		return true;
    	}
    	return false;
    }
//minimax algorithm for AI 
   function minimax(newboard,player){
   	var availspots=emptysquares();
   	if(checkWin(newboard,huPlayer)){
   		return{score:-10};
   	}else if(checkWin(newboard,aiplayer)){
   		return {score:10};
   	}else if(availspots.length === 0){
   		return  {score:0};
   	}
   	
   	var moves=[];
   	for(var i=0;i<availspots.length;i++){

       var mov={};
       mov.index=newboard[availspots[i]];
       newboard[availspots[i]]=player;

       if(player==aiplayer){
        var result=minimax(newboard,huPlayer);
        mov.score=result.score;

       }else{
         var result=minimax(newboard,aiplayer);
         mov.score=result.score;

       }
       newboard[availspots[i]]=mov.index;
       moves.push(mov);


   	}
   	var bestmove;
   	if(player === aiplayer){
   		var bestscore=-10000;
   		for(var j=0;j<moves.length;j++){
   			if(moves[j].score>bestscore){
   				bestscore=moves[j].score;
   				bestmove=j;

   			}
   			}
   		}else{
   			var bestscore=10000;
   			for(var j=0;j<moves.length;j++){
   				if(moves[j].score<bestscore){
   					bestscore=moves[j].score;
   					bestmove=j;
   				}
   			}
   		}

       return moves[bestmove];

   		}
   	


   


   
