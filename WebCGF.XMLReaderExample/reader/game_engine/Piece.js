/**
 * Creates a Piece with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param {number} boardX - The height of the board
 * @param {number} boardY - The width of the board
 * @param {number} x - X position where the piece will be placed
 * @param {number} y - Y position where the piece will be placed
 * @param {number} player - player making the move
 */
function Piece(scene, board, position, player){
    Object.call(this,scene);

    this.scene = scene;
    this.board = Vector.fromArray(board);
    this.position = Vector.fromArray(position);

    this.size=1;

    switch(player){
        case 1:
            this.piece = this.scene.nodes['player1'];
            break;
        case 2:
            this.piece = this.scene.nodes['player2'];
            break;
        default:
            console.e("Piece played in ("+x+","+y+") does not correspond to a valid player");
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
        this.scene.rotate(Math.PI/2,0,0,1);
        this.animation.apply(time);
        this.scene.rotate(-Math.PI/2, 0,0,1);
        this.piece.display();
    this.scene.popMatrix();
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
    var distance = this.board.subtract(this.position).length();
    var time = 5;

    var circularTranslation = this.createCircularTranslation(distance,time);
    var circularRotation = this.createCircularRotation(time);
    
    this.animation = new ComposedAnimation();
    this.animation.addAnimation(circularTranslation,0);
    this.animation.addAnimation(circularRotation,0);
};


Piece.prototype.createCircularTranslation=function(totalDistance,time){
    var distance = 0.2*totalDistance;
    var radius = distance/2;
    var center = [0,0,radius];
    
    return new CircularAnimation(this.scene, "circular_translation",center,radius, 90,-180,time);  
};

Piece.prototype.createCircularRotation= function(time){

    return new CircularAnimation(this.scene, "circular_rotation", [0,0,0],0,-90,180,time);  
};