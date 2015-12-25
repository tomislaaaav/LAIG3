/**
 * Class responsible for all the Board logics and display. 
 * @constructor
 * @param scene {MyScene} - scene
 * @param {number} x - The height of the board
 * @param {number} y - The width of the board
 */
function Board(scene, x,y){
    Object.call(this,scene);

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
        if(this.pieces[i].boardPiecePosition.toArray() == position){
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

Board.prototype.removeBoardPiece= function(x,y){
    var position = [x,0,y];
    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].boardPiecePosition.toArray() == position){
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

Board.prototype.stopRewind= function(){
    this.rewind = false;
}

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