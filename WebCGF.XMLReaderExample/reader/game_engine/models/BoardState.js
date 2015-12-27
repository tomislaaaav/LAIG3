/**
 * Creates an empty board with the given dimensions.
 * @constructor
 * @param dimensions {array} - board dimensions 
 */
function BoardState(dimensions, board){
    Object.call(this);

    this.dimensions = Vector.fromArray(dimensions);
    if(board != null)
        this.board = board;
    else
        this.board = this.createEmptyBoard(this.dimensions.x, this.dimensions.z);
};

/**
 * Stances that BoardState has the properties of a Object. 
 */
BoardState.prototype = Object.create(Object.prototype);

/**
 * Creates a BoardState.
 */
BoardState.prototype.constructor = BoardState;


BoardState.prototype.createEmptyBoard= function(x,y){
    var board=[];

    for(var i = 0; i < x; i++){
        var row = [];
        for(var j = 0; j < y; j++){
            var cell = [0,0];
            row.push(cell);
        }
        board.push(row);
    }

    return board;
};

BoardState.prototype.addPiece= function(x,y,player){
    this.board[x-1][y-1]=[0, player];
};

BoardState.boardDifferences= function(oldBoard, newBoard){
    if(oldBoard.dimensions.x != newBoard.dimensions.x || oldBoard.dimensions.z != newBoard.dimensions.z){
        console.error("Comparison between boards with different dimensions is not possible");
        return;
    }

    var differences=[];
    
    for(var i = 0; i < oldBoard.dimensions.x; i++){

        for(var j = 0; j < oldBoard.dimensions.z; j++){
            if(oldBoard.board[i][j][1] == newBoard.board[i][j][1]){
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

/**
 * Transform the response receive from the prolog server into an array
 */
BoardState.getStateFromResponse= function(response){
    var jsonResponse = response.replace(/\|/g,",");
    var array = JSON.parse(jsonResponse);
    return array;
};

/**
 * Get the JSON string of the current state to send to the prolog server 
 */
BoardState.prototype.getJSONString= function(){
    var string = JSON.stringify(this.board);
    //var jsonString = string.replace(/,/g,"|");
    return string;
};