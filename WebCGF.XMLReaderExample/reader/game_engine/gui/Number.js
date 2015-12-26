/**
 * Creates a Number with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param id 
 */
function Number(scene, id){
    Object.call(this);

    this.scene = scene;
    this.id = id;

    this.number = 0;

    this.numbersFigures = this.loadFigures();
    this.dot = this.scene.nodes['dot'];
}

/**
 * Stances that Tile has the properties of a CGFobject. 
 */
Number.prototype = Object.create(Object.prototype);

/**
 * Creates a Tile.
 */
Number.prototype.constructor = Tile;


Number.prototype.display = function(){
    this.scene.pushMatrix();
        if(this.number == 'dot')
            this.dot.display();
        else
            this.numbersFigures[this.number].display();
    this.scene.popMatrix();
};

Number.prototype.loadFigures= function(){
    var figures = [];
    var id = 'scoreboard_number_';
    
    for(var i = 0; i < 10 ; i++){
        figures.push(this.scene.nodes[id+i]);
    }
    return figures;
};

Number.prototype.setNumber= function(number){
    if (number === parseInt(number, 10) && number >= 0 && number < 10){
        this.number = number;
    }else{
        console.error(number + " is not an integer");
        return false;
    }  
};

Number.divideIntegerNumber= function(number){
    if(number !== parseInt(number,10) ){
        console.error(number + " is not an integer");
        return false;
    }
    var result = [];
    
    while(number != 0){
        remainder = number % 10;
        result.unshift(remainder);
        number = Math.floor(number/10)
    }

    return result;
};