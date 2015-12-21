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
        this.scene.scale(x,1,Math.floor(y/2) + 1);
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
    
    this.boardBody(this.x, this.y);
    for(var i = 1; i <= this.x; i++)
        for(var j = 1; j <= this.y; j++){
            this.drawMosaic(i,j);
        }
    
    this.scene.popMatrix();
}


/**
 * Set the board scale size
 */
BoardDraw.prototype.setSize= function(size){
    this.size = size;
};

BoardDraw.prototype.boardBody= function(x,y){
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
        this.scene.scale(1,1,Math.floor(y/2) + 1);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-x,0);
            this.scene.rotate(-Math.PI,0,0,1);  
            this.plate.display();  
        this.scene.popMatrix();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,-1,Math.floor(y/2) + 1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,1,x);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-(Math.floor(y/2) + 1),0);
            this.scene.rotate(-Math.PI,0,0,1);  
            this.plate.display();  
        this.scene.popMatrix();
    this.scene.popMatrix();
};