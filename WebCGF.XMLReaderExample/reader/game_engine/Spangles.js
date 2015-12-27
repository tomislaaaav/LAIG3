/**
 * Start a spangles game
 * @constructor
 * @param scene {CGFScene} - scene 
 */
function Spangles(scene){
    Object.call(this);

    this.scene = scene;

    this.connection = new Connection(this);
    this.newGame(5,5,"pvp");

    this.turnTime = 20;
    this.picking = true;
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

    if(this.timeLastCount == null)
        this.timeLastCount = time;
    
    var timePassed = (time - this.timeLastCount)*1e-3; 
    this.time += timePassed;

    if(timePassed >= this.turnTime){
        this.stateMachine.update("endTurn");
        console.log("Finished player "+this.stateMachine.currPlayer+" turn");
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