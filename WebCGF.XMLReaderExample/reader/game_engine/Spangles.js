/**
 * Start a spangles game
 * @constructor
 * @param scene {CGFScene} - scene 
 */
function Spangles(scene){
    Object.call(this);

    this.scene = scene;

    this.connection = new Connection(this);
    this.currPrologState = "";
    this.newGame(7,7,"pvp");

    this.turnTime = 20;
    this.picking = true;
    //this.connection.createBoard(7,7);
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


Spangles.prototype.newGame= function(x,y,mode){
    this.resetTimer();
    this.stopTimer();
    switch(mode){
        case "pvp":
            this.stateMachine = new Pvp(this);
            break;
        case "bot":
            //this.stateMachine = new PvB(this);
            break;
        default:
            console.error("Trying to start a game with the following mode: " + mode);
            return false;
    }
    this.board = new Board(this.scene, x,y);
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

    if(this.lastCount == null)
        this.lastCount = time;
    
    var timePassed = (time - this.lastCount)*1e-3; 
    this.time += timePassed;

    if(this.time >= this.turnTime){
        this.stateMachine.update("endTurn");
        console.log("Finished player "+this.stateMachine.currPlayer+" turn");
    }
};

Spangles.prototype.PlayerMakePlay= function(x,y){
    var player = this.stateMachine.currPlayer;
    board = this.board.state.getJSONString();
    //board = this.currPrologState;
    this.connection.playerMakeMove(board, player,x,y);
};

Spangles.prototype.receiveBoard= function(response){
    var newBoardState = BoardState.getStateFromResponse(response);
    this.currPrologState = response;
    this.board.newPlay(newBoardState);

    this.stateMachine.update("validPlay");
};

Spangles.prototype.failResponse= function(){
    this.stateMachine.update("fail");  
};

Spangles.prototype.pickTile= function(id){
    if(this.picking == false)
        return false;
    var position = this.board.boardTable.getPosFromCoords(id);
    this.PlayerMakePlay(position[0],position[1]);
};