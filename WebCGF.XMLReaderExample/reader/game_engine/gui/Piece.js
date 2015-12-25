/**
 * Creates a Piece with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param board {array} - board dimensions 
 * @param {number} position - position where the piece will be placed 
 * @param {number} player - player making the move
 */
function Piece(scene, board, position, player, duration){
    Object.call(this,scene);

    this.scene = scene;
    this.board = Vector.fromArray(board);
    this.boardPiecePosition = Vector.fromArray(position); 
    this.position = this.getPiecePosition(board,position,player);
    this.initPosition= new Vector.fromArray(BoardDraw.pieceInitPositions(board,player));

    this.size=1;

    if(duration === undefined)
        this.duration=5;
    else
        this.duration = duration;

    switch(player){
        case 1:
            this.piece = this.scene.nodes['player1'];
            break;
        case 2:
            this.piece = this.scene.nodes['player2'];
            break;
        default:
            console.error("Piece played in ("+x+","+y+") does not correspond to a valid player");
            return false;
            break;
    }
    
    this.player = player;
    this.animation = this.createAnimation();
    this.alignPieceAnimation = this.createAlignPieceAnimation(position,player);

};

/**
 * Stances that Piece has the properties of a CGFobject. 
 */
Piece.prototype = Object.create(Object.prototype);

/**
 * Creates a Piece.
 */
Piece.prototype.constructor = Piece;

/**
 * Draw the Piece
 */
Piece.prototype.display = function(time){
    this.scene.pushMatrix();
        this.scene.scale(this.size, this.size, this.size);

        var path = this.position.subtract(this.initPosition);
        var rotation = 0;
        if(this.player == 1){
            rotation = Math.PI - (Math.PI/2 - Math.atan2(path.x,path.z));
        }else
            rotation = Math.PI/2-Math.atan2(path.x,path.z);
        this.setInInitialPosition();

        this.scene.rotate(-rotation,0,1,0);        
        this.scene.rotate(Math.PI/2,0,0,1);
        
        this.animation.apply(time);
        
        this.scene.rotate(-Math.PI/2, 0,0,1);
        this.scene.rotate(rotation,0,1,0);

        this.alignPieceAnimation.apply(time);
        this.piece.display();
    this.scene.popMatrix();
};

Piece.prototype.setInInitialPosition = function(){
    this.scene.translate(this.initPosition.x,this.initPosition.y, this.initPosition.z);
    var rotation = BoardDraw.playerOrientation(this.player);
    this.scene.rotate(rotation, 0,1,0);
};

/**
 *
 */
Piece.prototype.getPiecePosition= function(board,boardPiecePosition,player){
    if(player == 1){
        return Vector.fromArray(BoardDraw.realCoordinates(board, BoardDraw.invertCoordinates(board,boardPiecePosition)));
    }else{
        return Vector.fromArray(BoardDraw.realCoordinates(board, boardPiecePosition));
    }

}

/**
 * Set the Piece scale size
 */
Piece.prototype.setSize= function(size){
    this.size = size;
};


/**
 * Create animation to insert piece.
 *
 */
Piece.prototype.createAnimation= function(){
    var path = this.position.subtract(this.initPosition);
    var distance = path.length();
    
    this.movePieceDuration = this.duration*0.8;
    this.liftPieceDuration = this.duration*0.1; 

    var circularTranslation = this.createCircularTranslation(distance,this.movePieceDuration);
    var circularRotation = this.createCircularRotation(this.movePieceDuration);
    var translation = this.createTranslation(distance,this.movePieceDuration);

    var liftPiece = this.liftPieceAnimation(Piece.getPieceHeight(), "lift_piece",this.liftPieceDuration);
    var dropPiece = this.liftPieceAnimation(-Piece.getPieceHeight(), "drop_piece", this.liftPieceDuration);

    
    

    var animation = new ComposedAnimation();
    this.animation.addAnimation(liftPiece, 0);
    this.animation.addAnimation(circularTranslation,this.liftPieceDuration);
    this.animation.addAnimation(circularRotation,this.liftPieceDuration);
    this.animation.addAnimation(translation,this.liftPieceDuration);
    this.animation.addAnimation(dropPiece, this.liftPieceDuration + this.movePieceDuration);
    return animation;
};



Piece.prototype.liftPieceAnimation= function(height, id,time){
    var initPoint = [0,0,0];
    var finishPoint = [height,0,0];
    var controlPoints = [initPoint,finishPoint];
    var animation = new LinearAnimation(this.scene,id ,controlPoints, time);
    animation.setRotation(false);
    return animation;
}
Piece.prototype.createCircularTranslation=function(totalDistance,time){
    var distance = 0.3*totalDistance;
    var radius = distance/2;
    var center = [0,0,radius];
    
    return new CircularAnimation(this.scene, "circular_translation",center,radius, 90,-180,time);  
};

Piece.prototype.createCircularRotation= function(time){

    return new CircularAnimation(this.scene, "circular_rotation", [0,0,0],0,-90,180,time);  
};

Piece.prototype.createTranslation= function(totalDistance, time){
    distance = totalDistance*0.7;
    initPoint= [0,0,0];
    finishPoint = [0,0,distance];
    controlPoints= [initPoint,finishPoint];
    
    return new LinearAnimation(this.scene, "piece_translation", controlPoints,time);
};

Piece.getPieceHeight= function(){
    return 0.2;
}

/**
 * Creates an animation to rotate the piece if:
 * -the piece needs to be inverted and you are player 1
 * -the piece doesn't need to be inverted and you are player 2
 */
Piece.prototype.createAlignPieceAnimation= function(position, player){
    var animation = new ComposedAnimation();

    var correctPosition = new LinearAnimation(this.scene, "correctPosition", [[0,0,0],[0,0,1]], this.movePieceDuration)
    animation.addAnimation(correctPosition, this.liftPieceDuration);
        
    if((BoardDraw.isPieceInverted(position) && player==1)
        || (!BoardDraw.isPieceInverted(position) && player == 2)){      
        var alignPieceAnimation = new CircularAnimation(this.scene, "align_piece",[0,0,0],0,0,180,this.movePieceDuration);
        animation.addAnimation(alignPieceAnimation,this.liftPieceDuration);
    }else{
              
    }
    return animation;
};



/**
 *
 */
Piece.prototype.setDuration= function(duration){
    this.duration = duration;
    this.animation = this.createAnimation();
};