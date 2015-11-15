function Vehicle(scene,id){
	Object.call(this);
	this.id =id;
	this.scene = scene;

    this.c1 = [];
    this.c2 = [];
    this.c3 = [];

    this.c1.push([[-2,0,2, 1], [-2,0,0, 1], [-2,0,-2, 1]]);
    this.c1.push([[0,3,2, 1], [0,3,0, 1], [0,3,-2, 1]]);
    this.c1.push([[2,0,2, 1], [2,0,0, 1], [2,0,-2, 1]]);

    this.c2.push([[-2,0,2, 1], [-2,0,2, 1], [-2,0,2, 1]]);
    this.c2.push([[0,-3,2, 1], [0,0,20, 1], [0, 3, 2, 1]]);
    this.c2.push([[2,0,2, 1], [2,0,2, 1], [2,0,2, 1]]);

    this.c3.push([[-2,0,2, 1], [-2,0,2, 1], [-2,0,2, 1]]);
    this.c3.push([[0,-3,2, 1], [0,0,2, 1], [0, 3, 2, 1]]);
    this.c3.push([[2,0,2, 1], [2,0,2, 1], [2,0,2, 1]]);

    this.brown = new CGFappearance(this.scene);
    this.grey = new CGFappearance(this.scene);

    var filename = getUrlVars()['file'] || "myScene/scene.lsx";
    this.fullFileName = 'scenes/' + filename;

    var path_brown = this.fullFileName.substring(0, this.fullFileName.lastIndexOf("/")) + "/textures/brown.jpg";

    var path_grey = this.fullFileName.substring(0, this.fullFileName.lastIndexOf("/")) + "/textures/grey.jpg";
    
    this.brown.loadTexture(path_brown);
    this.brown.setSpecular(1, 1, 1, 1);
    this.brown.setShininess(10);
    this.brown.setDiffuse(0, 0, 0, 1);

    this.grey.loadTexture(path_grey);
    this.grey.setSpecular(1, 1, 1, 1);
    this.grey.setShininess(10);
    this.grey.setDiffuse(0, 0, 0, 1);

    this.p1 = new Patch(this.scene, this.id, 2, 2, 10, 10, this.c1);

    this.p2 = new Patch(this.scene, this.id, 2, 2, 10, 10, this.c2);

    this.p3 = new Patch(this.scene, this.id, 2, 2, 10, 10, this.c3);
};

Vehicle.prototype = Object.create(Object.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display= function(parentTexture, parentMaterial, currTime){

    this.scene.translate(10, 8, 10);
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.pushMatrix();
    this.brown.apply();
    
    this.p1.display();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.p1.display();
    this.scene.popMatrix();

    this.grey.apply();
    this.p2.display();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.brown.apply();
    this.p3.display();
    this.scene.popMatrix();
    
    this.scene.popMatrix();
};
