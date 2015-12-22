/**
 * Creates a Piece with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param board {array} - board dimensions 
 * @param {number} position - position where the 
 * @param {number} player - player making the move
 */
function Piece(scene, board, position, player){
    Object.call(this,scene);

    this.scene = scene;
    this.board = Vector.fromArray(board);
    this.boardPiecePosition = Vector.fromArray(position); 
    this.position = Vector.fromArray(BoardDraw.realCoordinates(board, position));
    this.initPosition= new Vector.fromArray(BoardDraw.pieceInitPositions(board,player));

    this.size=1;

    switch(player){
        case 1:
            this.piece = this.scene.nodes['player1'];
            break;
        case 2:
            this.piece = this.scene.nodes['player2'];
            break;
        default:
            console.error("Piece played in ("+x+","+y+") does not correspond to a valid player");
            break;
    }
    
    this.player = player;
    this.createAnimation();
}

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

        this.setInInitialPosition();
        this.scene.rotate(Math.PI/2,0,0,1);
            
        this.animation.apply(time);
        

        this.scene.rotate(-Math.PI/2, 0,0,1);
        
        this.piece.display();
    this.scene.popMatrix();
};

Piece.prototype.setInInitialPosition = function(){
    this.scene.translate(this.initPosition.x,this.initPosition.y, this.initPosition.z);
    var rotation = BoardDraw.playerOrientation(this.player);
    this.scene.rotate(rotation, 0,1,0);

};


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
    var distance = this.initPosition.subtract(this.position).length();

    var time = 5;
    var movePieceTime = time*0.8;
    var liftPieceTime = time*0.1; 

    var circularTranslation = this.createCircularTranslation(distance,movePieceTime);
    var circularRotation = this.createCircularRotation(movePieceTime);
    var translation = this.createTranslation(distance,movePieceTime);

    var liftPiece = this.liftPieceAnimation(Piece.getPieceHeight(), "lift_piece",liftPieceTime);
    var dropPiece = this.liftPieceAnimation(-Piece.getPieceHeight(), "drop_piece", liftPieceTime);

    this.animation = new ComposedAnimation();
    this.animation.addAnimation(liftPiece, 0);
    this.animation.addAnimation(circularTranslation,liftPieceTime);
    this.animation.addAnimation(circularRotation,liftPieceTime);
    this.animation.addAnimation(translation,liftPieceTime);
    this.animation.addAnimation(dropPiece, liftPieceTime+movePieceTime);
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