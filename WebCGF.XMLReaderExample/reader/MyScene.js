/**
 * MyScene constructor
 * @constructor
 * @param scene - The scene
 */
function MyScene(scene){
	CGFscene.call(this);
};

/**
 * Stances that MyScene has the properties of a CGFscene.
*/
MyScene.prototype = Object.create(CGFscene.prototype);

/**
 * Creates a MyScene.
 */
MyScene.prototype.constructor = MyScene;

/**
 * Creates the axis on the object MyScene and enables all of the required functions to print the objects on the screen, such as the backface culling, enable textures, and the depth test.
 */
MyScene.prototype.init = function (application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.enableTextures(true);

	this.initLights();

	this.enabledLights = [];

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	this.axis=new CGFaxis(this);
	this.initInterface();
	this.setPickEnabled(true);

	this.currentLSX = 0;
};

/**
 * Creates the camera.
 */
MyScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(40, 25, 40), vec3.fromValues(0, 0, 0));
};

/**
 * Creates a default appearance.
 */
MyScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.2, 0.2, 1.0);
    this.setDiffuse(0.2, 0.2, 0.2, 1.0);
    this.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop

/**
 * Handler that is called when the graph is loaded.
 * Switches all of the lights that exist with the ones on the graph.
 * Sets the background and ambient light.
 * Sets the textures, materials, leaves, nodes ad rootID that exist only on the graph.
 */
MyScene.prototype.onGraphLoaded = function ()
{

    this.camera.near = this.graph.frustum[0];
    this.camera.far = this.graph.frustum[1];

    if (this.graph.reference >= 0)
	   this.axis = new CGFaxis(this, this.graph.reference);

	this.gl.clearColor(this.graph.backgroundLight[0],this.graph.backgroundLight[1],this.graph.backgroundLight[2],this.graph.backgroundLight[3]);
	this.setGlobalAmbientLight(this.graph.ambientLight[0],this.graph.ambientLight[1],this.graph.ambientLight[2],this.graph.ambientLight[3]);

    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights[i] = this.graph.lights[i];
    	this.lights[i].setVisible(true);
    	this.lights[i].update();
    	console.log("loaded light id="+this.lights[i].lightID);
    	this.enabledLights[this.lights[i].lightID] = this.lights[i].enabled;
    }
	this.initialTransformations = this.graph.initialTransformations;
	this.textures = this.graph.textures;
	this.materials = this.graph.materials;
	this.leaves = this.graph.leaves;
	this.nodes = this.graph.nodes;
	this.rootID = this.graph.rootID;

	this.textures1 = this.graph1.textures;
	this.materials1 = this.graph1.materials;
	this.leaves1 = this.graph1.leaves;
	this.nodes1 = this.graph1.nodes;
	this.rootID1 = this.graph1.rootID;

	this.textures2 = this.graph2.textures;
	this.materials2 = this.graph2.materials;
	this.leaves2 = this.graph2.leaves;
	this.nodes2 = this.graph2.nodes;
	this.rootID2 = this.graph2.rootID;

	this.textures3 = this.graph3.textures;
	this.materials3 = this.graph3.materials;
	this.leaves3 = this.graph3.leaves;
	this.nodes3 = this.graph3.nodes;
	this.rootID3 = this.graph3.rootID;

	this.nodesArray = [this.nodes, this.nodes1, this.nodes2, this.nodes3];
	this.texturesArray = [this.textures, this.textures1, this.textures2, this.textures3];
	this.materialsArray = [this.materials, this.materials1, this.materials2, this.materials3];
	this.leavesArray = [this.leaves, this.leaves1, this.leaves2, this.leaves3];
	this.rootIDArray = [this.rootID, this.rootID1, this.rootID2, this.rootID3];

	console.log("Graph Loaded");

	this.scoreBoard = new ScoreBoard(this);

	this.game = new Spangles(this);

	this.timer = 0;
  this.setUpdatePeriod(100/6);
};

MyScene.prototype.initInterface= function(){
	this.turnDuration = Spangles.defaultTurnDuration();
	this.botDifficulty = 1;
	this.botDiffList = Spangles.getDifficultyList();

	this.boardX = 5;
	this.boardY = 5;
};

/**
 * Clears image, draws axis, updates the lights and displays all of the nodes.
 */
MyScene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();

    console.log("Ended background, camera and axis setup")

    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk && this.graph1.loadedOk && this.graph2.loadedOk && this.graph3.loadedOk){
			this.applyInitTransformations();

		for(var i = 0; i < this.lights.length; i++){
			this.lights[i].update();
		}

		switch(this.currentLSX) {
			case 0:
			break;
			case 1:
			break;
			case 2:
			break;
			case 3:
			break;
			default:
			break;
		}

		this.game.display(this.timer);
		this.logPicking();
		this.nodesArray[this.currentLSX][this.rootIDArray[this.currentLSX]].display(null, null, this.timer);

		this.pushMatrix();
			this.translate(0,1,7);
			this.rotate(-5*Math.PI/4, 0,1,0);
			this.scoreBoard.display();
		this.popMatrix();
    };
};

MyScene.prototype.setInterface= function(newInterface) {
	this.interface = newInterface;
}

MyScene.prototype.applyInitTransformations= function(){
	this.initialTransformations['translation'].apply();

	var rotation = this.initialTransformations['rotation'];
	rotation[0].apply();
	rotation[1].apply();
	rotation[2].apply();

	this.initialTransformations['scale'].apply();
};

MyScene.prototype.DefaultAmbient = function() {
	this.currentLSX = 0;
}

MyScene.prototype.FirstAmbient = function() {
	this.currentLSX = 1;
}

MyScene.prototype.SecondAmbient = function() {
	this.currentLSX = 2;
}

MyScene.prototype.ThirdAmbient = function() {
	this.currentLSX = 3;
}

MyScene.prototype.updateLight= function(lightID, state){
	for (var i=0; i < this.lights.length; i++) {
		if (this.lights[i].lightID == lightID) {
			if(state) {
				console.log("Enable light="+this.lights[i].lightID);
				this.lights[i].enable()
				this.lights[i].update();
			}else{
				console.log("Disable light="+this.lights[i].lightID);
				this.lights[i].disable();
				this.lights[i].update();
			}
			return;
		}
	}
};

MyScene.prototype.update = function(currTime) {
	if (this.lastUpdate != 0)
		this.timer += (currTime - this.lastUpdate);
	this.game.update(this.timer);
	this.scoreBoard.updateTime(this.timer);
}


MyScene.prototype.initLights = function () {

	if (this.lights.length > 0) {
		this.lights[0].setPosition(0,0,15,1);
		this.lights[0].setAmbient(0.1,0.1,0.1,1);
		this.lights[0].setDiffuse(0.9,0.9,0.9,1);
		this.lights[0].setSpecular(0,0,0,1);
		this.lights[0].enable();
		this.lights[0].update();
	}
};

MyScene.prototype.logPicking = function ()
 {
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i=0; i< this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj){
                    var customId = this.pickResults[i][1];
                    this.game.pickTile(customId);
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.pickResults.splice(0,this.pickResults.length);
        }
    }
};


MyScene.prototype.NewGamePVP=function(){
	var x = (this.boardX > Math.floor(this.boardX) + 0.9) ? Math.ceil(this.boardX): Math.floor(this.boardX);
	var y = (this.boardY > Math.floor(this.boardY)+0.9)? Math.ceil(this.boardY) : Math.floor(this.boardY);
	this.game.newGame(x,y,"pvp", this.turnDuration);
};

MyScene.prototype.NewGameBot = function(){
	var x = (this.boardX > Math.floor(this.boardX) + 0.9) ? Math.ceil(this.boardX): Math.floor(this.boardX);
	var y = (this.boardY > Math.floor(this.boardY)+0.9)? Math.ceil(this.boardY) : Math.floor(this.boardY);
	this.game.newGame(x, y, "bot", this.turnDuration, this.botDifficulty);
};

MyScene.prototype.Undo= function(){
	this.game.undo();
};
