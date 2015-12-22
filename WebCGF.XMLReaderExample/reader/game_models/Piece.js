/**
 * Creates a Piece with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param {number} x - The height of the board
 * @param {number} y - The width of the board
 */
function Piece(scene, x, y, player){
    Object.call(this,scene);

    this.scene = scene;
    this.x = x;
    this.y = y;
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
Piece.prototype.createAnimation= function(size){
    this.animation = new ComposedAnimation()
};
