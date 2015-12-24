/**
 * Creates an empty board with the given dimensions.
 * @constructor
 * @param dimensions {array} - board dimensions 
 */
function BoardInfo(scene, dimensions){
    Object.call(this,scene);

    this.scene = scene;
    this.dimensions = Vector.fromArray(dimensions);

    this.board = this.createEmptyBoard(this.dimensions.x, this.dimensions.z);
};

/**
 * Stances that BoardInfo has the properties of a CGFobject. 
 */
BoardInfo.prototype = Object.create(Object.prototype);

/**
 * Creates a BoardInfo.
 */
BoardInfo.prototype.constructor = BoardInfo;

BoardInfo.prototype.createEmptyBoard= function(x,y){
    var board=[];

    for(var i = 0; i < x; i++){
        var row = [];
        for(var j = 0; j < y; j++){
            var cell = [null,null];
            row.push(cell);
        }
        board.push(row);
    }

    return board;
};

BoardInfo.prototype.addPiece= function(x,y,player){
    this.board[x+1][y+1]=[null, player];
};

BoardInfo.boardDifferences= function(oldBoard, newBoard){
    if(oldBoard.dimensions != newBoard.dimensions){
        console.error("Comparison between boards with different dimensions is not possible");
        return;
    }

    var differences=[];
    
    for(var i = 0; i < oldBoard.dimensions.x; i++){

        for(var j = 0; j < oldBoard.dimensions.z; j++){
            if(oldBoard.board[i][j] == newBoard.board[i][j]){
                continue;
            }else{
                var diff = [];
                diff["x"] = i+1;
                diff["y"] = j+1;

                diff["cell"] = newBoard.board[i][j];
                differences.push(diff);
            }
        }
    }
    
    return differences;
}