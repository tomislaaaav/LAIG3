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

    this.state = new BoardState(x,y);
    this.boardTable = new BoardDraw(scene, x,y);
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
    this.boardTable.display();
}