/**
 * Start a spangles game
 * @constructor
 * @param scene {CGFScene} - scene 
 */
function Spangles(scene){
    Object.call(this);

    this.scene = scene;

    this.turnTime = Spangles.defaultTurnDuration();
    this.picking = true;
    this.results = [];
    this.results['winner'] = null;
    this.results['emptyCells'] = null;

    this.connection = new Connection(this);
    this.scoreBoard = this.scene.scoreBoard;
    this.newGame(5,5,"pvp");

    this.score =[0,0];

};

/**
 * Stances that Spangles has the properties of a Object. 
 */
Spangles.prototype = Object.create(Object.prototype);

/**
 * Creates a Spangles.
 */
Spangles.prototype.constructor = Spangles;

Spangles.prototype.display= function(time){
    this.board.display(time);  
};


Spangles.prototype.newGame= function(x,y,mode, time,difficulty){
    this.turnTime = time || 20;
    this.resetTimer();
    this.stopTimer();
    switch(mode){
        case "pvp":
            this.stateMachine = new Pvp(this);
            break;
        case "bot":
            this.stateMachine = new Pvb(this);
            this.difficulty = difficulty || 1; 
            break;
        default:
            console.error("Trying to start a game with the following mode: " + mode);
            return false;
    }
    this.board = new Board(this.scene, x,y);
    this.scoreBoard.resetBoard();
};

Spangles.prototype.resetTimer = function(){
    this.timeLastCount = null;
    this.time = 0;
    this.timerActiv = true;
};

Spangles.prototype.resumeTimer = function(){
    this.timeLastCount = null;
    this.timerActiv = true;
};

Spangles.prototype.stopTimer= function(){
    this.timerActiv = false;
};

Spangles.prototype.update= function(time){
    if(this.timerActiv == false)
        return;


    if(this.timeLastCount == null)
        this.timeLastCount = time;
    
    var timePassed = (time - this.timeLastCount)*1e-3; 
    this.time += timePassed;

    this.scoreBoard.updateTurn(Math.floor(timePassed));

    if(timePassed >= this.turnTime){
        this.stateMachine.update("endTurn");
        console.log("Player "+this.stateMachine.currPlayer+" missed his turn");
    }
};

Spangles.prototype.PlayerMakePlay= function(x,y){
    var player = this.stateMachine.currPlayer;
    board = this.board.state.getJSONString();
    var type = 1;
    if(BoardDraw.isPieceInverted([x,0,y]))
        type = 2;
    this.stateMachine.update("sendRequest");
    console.log("Player "+player+" will play in ("+x+","+y+")");
    this.connection.playerMakeMove(board, player,x,y,type);
};

Spangles.prototype.botMakePlay= function(player){
    var difficulty = this. difficulty;
    board = this.board.state.getJSONString(); 
    this.stateMachine.update("sendRequest");
    console.log("Bot "+player+" will try to play.");   
    this.connection.botMove(board, player, difficulty);
}

Spangles.prototype.receiveBoard= function(response){
    var newBoardState = new BoardState(null,BoardState.getStateFromResponse(response));
    this.currPrologState = response;
    this.board.newPlay(newBoardState);
    console.log("Valid play by player "+this.stateMachine.currPlayer);
    this.stateMachine.update("validPlay");
};

Spangles.prototype.failResponse= function(){
    console.log("Failed play by player "+this.stateMachine.currPlayer);
    this.stateMachine.update("fail");  
};

Spangles.prototype.pickTile= function(id){
    if(this.picking == false)
        return false;
    var position = this.board.boardTable.getPosFromCoords(id);
    console.log("Pick tile with position ("+position[0]+","+position[1]+")")
    this.PlayerMakePlay(position[0],position[1]);
};

Spangles.prototype.receiveWinner= function(state){
    if(state != false){
        this.results.winner = true;
        this.stateMachine.currPlayer = state;
        this.stateMachine.update("won");
    }else{
        this.results.winner = false;
        if(isVerificationComplete(this.results)){
            this.stateMachine.update("continue");
        }
    }      
};

Spangles.prototype.receiveHasAvailabeCells= function(state){
    if(state){
        this.results.emptyCells = true;
        if(isVerificationComplete(this.results)){
            this.stateMachine.update("continue");
        }
    }else{
        this.results.emptyCells = false;
        this.stateMachine.update("full");        
    } 
};

Spangles.prototype.startVerification= function(){
    var board = this.board.state.getJSONString();
    this.connection.verifyWinner(board);
    this.connection.hasAvailableCells(board);
};

Spangles.prototype.resetResults= function(){
    this.results.winner = null;
    this.results.emptyCells = null;  
};

Spangles.prototype.updateScore= function(player,points){
    this.score[player-1] = points;
    switch(player){
        case 1:
            this.scoreBoard.setPlayer1Points(this.score[player-1]);
            break;
        case 2:
            this.scoreBoard.setPlayer2Points(this.score[player-1]);        
            break;
        default:
            connsole.error("Unidentified player. Trying to change score for player: "+player);
            break;
    }
};

Spangles.prototype.resetScores=function(){
    this.scoreBoard.setPlayer1Points(0);
    this.scoreBoard.setPlayer2Points(0);
}

Spangles.prototype.undo= function(){
    this.stateMachine.update("undo");
}

Spangles.prototype.undoPlay= function(){
    if(!this.board.undoPlay()){
        alert("You can't undo to an empty game");
        return false;
    }
    return true;
}

Spangles.getDifficultyList= function(){
    return [1,2];
};

Spangles.defaultTurnDuration= function(){
    return 20;
}

function isGameFinished(results){
    if(results.winner || !results.emptyCells){
        return false;
    }else{
        return true
    }
};

function isVerificationComplete(results){
    if(results.winner == null || results.emptyCells == null){
        return false;
    }else{
        return true;
    }
};

