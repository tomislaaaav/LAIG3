/**
 * Creates a BoardDraw with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param {number} x - The height of the board
 * @param {number} y - The width of the board
 */
function BoardDraw(scene, x,y){
    Object.call(this,scene);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size=1;


    this.plate = this.scene.nodes['plate'];
    this.mosaic= this.scene.nodes['plate_mosaic'];
    this.piece1= this.scene.nodes['player1'];
    this.piece2= this.scene.nodes['player2']
}

/**
 * Stances that BoardDraw has the properties of a CGFobject. 
 */
BoardDraw.prototype = Object.create(Object.prototype);

/**
 * Creates a BoardDraw.
 */
BoardDraw.prototype.constructor = BoardDraw;


BoardDraw.prototype.drawPlates = function(x,y){
    this.scene.pushMatrix();
        this.scene.scale(x,1,(y+1)/2);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-1,0);
            this.scene.rotate(Math.PI,0,0,1);
            this.plate.display();
        this.scene.popMatrix();  
    this.scene.popMatrix();

}

BoardDraw.prototype.drawMosaic = function(x,y){
    
    this.scene.pushMatrix();

    this.scene.translate(this.x-x,0,(this.y-y)*0.5);
    
    //Place the center of the mosaic in the position (0.5,0,0.5)
    this.scene.translate(1,0,0.5);
    
    //Change the mosaic from up or down according to its position on the board
    if(y%2 == 0){
        this.scene.translate(-1,0,0);
        this.scene.rotate(Math.PI/2,0,1,0);
    }else{
        this.scene.rotate(-Math.PI/2,0,1,0);
    }
    this.mosaic.display();
    this.scene.popMatrix();
}

/**
 * Draw the board
 */
BoardDraw.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.scale(this.size, this.size, this.size);

    this.placePieces(this.x, this.y);
    this.boardBody(this.x, this.y);
        this.scene.pushMatrix();
            this.scene.translate(1,0,0);
            for(var i = 1; i <= this.x; i++)
                for(var j = 1; j <= this.y; j++){
                    this.drawMosaic(i,j);
                }
        this.scene.popMatrix();
    
    this.scene.popMatrix();
}

/**
 * Place the pieces in the border of the board
 */
BoardDraw.prototype.placePieces= function(x,y){
    this.scene.pushMatrix();
        var piece2 = BoardDraw.pieceInitPositions([x,0,y],2);
        this.scene.translate(piece2[0],0,piece2[2]);
        this.scene.rotate(BoardDraw.playerOrientation(2),0,1,0);
        this.piece2.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        var piece1 = BoardDraw.pieceInitPositions([x,0,y],1);
        this.scene.translate(piece1[0],0,piece1[2]);
        this.scene.rotate(BoardDraw.playerOrientation(1),0,1,0);
        this.piece1.display();
    this.scene.popMatrix();
}


/**
 * Set the board scale size
 */
BoardDraw.prototype.setSize= function(size){
    this.size = size;
};

BoardDraw.prototype.boardBody= function(x,y){
    x +=2;
    this.scene.pushMatrix();
        this.scene.scale(1,0.5,1);
        this.drawPlates(x,y);
        this.drawBorders(x,y);
    this.scene.popMatrix();
};

BoardDraw.prototype.drawBorders= function(x,y){
    
    this.scene.pushMatrix();
        
        this.scene.translate(0,-1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,1,(y+1)/2);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-x,0);
            this.scene.rotate(-Math.PI,0,0,1);  
            this.plate.display();  
        this.scene.popMatrix();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,-1,(y+1)/2);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,1,x);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-(y+1)/2,0);
            this.scene.rotate(-Math.PI,0,0,1);  
            this.plate.display();  
        this.scene.popMatrix();
    this.scene.popMatrix();
};

BoardDraw.pieceInitPositions= function(board, player){
    switch(player){
        case 1:
            var boardDimensions = Vector.fromArray(board);
            var x = boardDimensions.x + 2;
            var y =(boardDimensions.z +1)/4;
            return [x,0,y];
            break;
        case 2:
            var boardDimensions = Vector.fromArray(board);
            var x = 0;
            var y =(boardDimensions.z +1)/4;
            return [x,0,y];
            break;
        default:
            console.error("Player "+player+" doesn't exist");
            break;
    }
};

BoardDraw.realCoordinates= function(board,coordinates){
    var x = coordinates[0];
    var y = (board[2] - coordinates[2]+1)*0.5;
    return [x,0,y];
};

BoardDraw.invertCoordinates= function(board, coordinates){
    var x = board[0] - coordinates[0] + 1; 
    var y = board[2] - coordinates[2] + 1;
    return [x,0,y];
};

BoardDraw.isPieceInverted= function(coordinates){
    if(coordinates[2]%2 == 0){
        return true;
    }else{
        return false;        
    }
};

BoardDraw.playerOrientation= function(player){
    switch(player){
        case 1:
            return -Math.PI/2;
        case 2:
            return Math.PI/2;
        
    }  
};