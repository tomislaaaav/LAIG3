/**
 * Class responsible for all the Board logics and display. 
 * @constructor
 * @param scene {MyScene} - scene
 * @param {number} x - The height of the board
 * @param {number} y - The width of the board
 */
function Board(scene, x,y){
    Object.call(this);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dimensions = Vector.fromArray([x,0,y]);

    this.state = new BoardState([x,0,y]);
    this.boardTable = new BoardDraw(scene, x,y);

    this.boardHistory=[];

    this.pieces = [];

    this.rewindIndex = 0;
    this.rewind = false;
};

/**
 * Stances that Board has the properties of a CGFobject. 
 */
Board.prototype = Object.create(Object.prototype);

/**
 * Creates a Board.
 */
Board.prototype.constructor = Board;



/**
 * Draw the board
 */
Board.prototype.display = function(time){
    if(this.rewind == true){
        this.rewindGame(time);
    }

    this.boardTable.display();
    for(var i = 0; i < this.pieces.length; i++){
        this.pieces[i].display(time);
    }
}

Board.prototype.setSpeed= function(speed){
    switch(speed){
        case "slow":
            this.speed = 10;
            break;
        case "normal":
            this.speed = 5;
            break;
        case "fast":
            this.speed = 2;
            break;
        case "superfast":
            this.speed = 1;
            break;
        default:
            console.erro("Selected speed doesn't exist");
            return false;
    }
};

/**
 * Add a piece to the board
 * @param {number} player - player making the play 
 * @param {number} x - The x position where the piece will be placed 
 * @param {number} y - The y position where the piece will be placed
 * @return - true if the piece was correctly placed. False if there is already a piece in that position  
 */
Board.prototype.play= function(player,x,y){
    
    var board = this.dimensions.toArray();
    var position = [x,0,y];

    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].boardPiecePosition.equals(Vector.fromArray(position))){
            console.error="There already is a piece in the position ("+x+","+y+")";
            return false;
        }
    }

    var piece = new Piece(this.scene, board, position, player, this.speed);
    if(piece == false)
        return false;
    this.pieces.push(piece);
    return true;
};

Board.prototype.newPlay= function(newBoard){
    return this.switchBoards(this.state, newBoard);
};

Board.prototype.switchBoards= function(oldBoard, newBoard){
    var differences = BoardState.boardDifferences(oldBoard, newBoard);
    for(var i = 0; i < differences.length; i++){
        if(!this.applyBoardDifference(differences[i]))
            return false;
    }

    this.boardHistory.push(oldBoard);
    this.state = newBoard;
    return true;
};

/**
 * Removes the visual representation of a piece from the board.
 * @param x {number} - x position of the piece in the board
 * @param y {number} - y position of the piece in the board
 * @return - false if there isn't a piece in that position. Else returs true
 */
Board.prototype.removeBoardPiece= function(x,y){
    var position = [x,0,y];
    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].boardPiecePosition.equals(Vector.fromArray(position))){
            this.pieces.splice(i,1);
            return true;
        }
    }

    return false;
};

Board.prototype.applyBoardDifference= function(difference){
    if(difference.cell[1] == null){
        return this.removeBoardPiece(difference.x, difference.y);
    }else{
        return this.play(difference.cell[1],difference.x,difference.y); 
    }
};

/**
 * Starts the rewind state of the Board. The Board will start from the 
 * first element of the boardHistory and execute all the following states as if the game would be played again.
 * The animations speed increases from normal to fast.
 */
Board.prototype.startRewind= function(){
    if(this.boardHistory[0] == null){
        console.error("There are no plays in the history that can be rewind");
        return false;
    }
    this.setSpeed("fast");
    
    if(this.boardHistory.indexOf(this.state) == -1)
        this.boardHistory.push(this.state);
    this.state = this.boardHistory[0];
    this.rewind = true;
    this.rewindIndex = 1;
    this.rewindInitTime = null;
};

/**
 * Stops the rewind state of the Board. 
 */
Board.prototype.stopRewind= function(){
    this.rewind = false;
}

/**
 * Handles the exchange of states during the rewind state.
 */
Board.prototype.rewindGame= function(time){
    if(this.rewindInitTime == null){
        this.rewindInitTime = time;
    }

    var minutes = (time- this.rewindInitTime)*1e-3;
    if(this.rewindIndex >= this.boardHistory.length){
        console.log("Finished rewind");
        return false;
    }

    if(minutes >= this.rewindIndex*this.speed){
        this.newPlay(this.boardHistory[this.rewindIndex]);
        this.rewindIndex++;  
    }
};


/**
 * Goes to the boardHistory vector, removes the latest element and sets it as the current state
 * @return - Returns false if the boardHistory vector is empty, else returns true
 */
Board.prototype.undoPlay= function(){
    if(this.boardHistory.length == 0){
        console.error("You can't undo to an empty game");
        return false;
    }  
    
    var index = this.boardHistory.length - 1;
    this.switchBoards(this.state,this.boardHistory[index]);
    this.boardHistory.splice(index,1);
    this.boardHistory.splice(index+1,1);
    return true;
};