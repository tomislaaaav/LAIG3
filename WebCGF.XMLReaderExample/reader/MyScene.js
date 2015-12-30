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
	console.log("Graph Loaded");

	this.scoreBoard = new ScoreBoard(this);

	this.game = new Spangles(this);

	this.timer = 0;
  this.setUpdatePeriod(100/6);

	this.rotateCamera = false;
	this.cameraRotation = 0;
	this.changeCamera = false;
	this.changeCamera_1 = false;
	this.cameraTranslate = vec4.fromValues(0, 0, 0, 0);
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
    if (this.graph.loadedOk){
			this.applyInitTransformations();

		for(var i = 0; i < this.lights.length; i++){
			this.lights[i].update();
		}

		this.game.display(this.timer);
		this.logPicking();
		//this.nodes[this.rootID].display(null, null, this.timer);

		this.pushMatrix();
			this.translate(0,1,7);
			this.rotate(-5*Math.PI/4, 0,1,0);
			this.scoreBoard.display();
		this.popMatrix();

		this.animateCamera();

		}
};

MyScene.prototype.setInterface= function(newInterface) {
	this.interface = newInterface;
};
/*
MyScene.prototype.boardPerspectiveCamera = function () {
	if (this.changeCamera && this.changeCamera_1 == false) {
		if (this.cameraTranslate.x >= 36.774 && this.cameraTranslate.y >= 25.527 && this.cameraTranslate.z >= 182.232) {
			this.changeCamera_1 = true;
			this.cameraTranslate = null;
		}
		else {
			this.camera.translate(this.cameraTranslate * this.time_elapsed/100000000);
			this.cameraTranslate = this.cameraTranslate + this.cameraTranslate * this.time_elapsed/100000000;
		}
		this.camera.setTarget(vec4.fromValues(37.467, 17.761, 3.606, 0));
	}

	if (this.changeCamera_1 == true && this.changeCamera == false)  {
			this.camera.setPosition(vec4.fromValues(10, 20, 10, 0));
			this.camera.setTarget(vec4.fromValues(8, 3, 8, 0));
			this.camera.direction = vec4.fromValues(0.004, -0.043, -0.999);
			this.changeCamera_1 = false;
	}
}
*/

MyScene.prototype.animateCamera = function() {
	if (this.rotateCamera) {
			if (this.cameraRotation >= Math.PI/2) {
					this.rotateCamera = false;
					this.cameraRotation = 0;
			}
			else {
					if (this.cameraRotation + this.time_elapsed / 1000 >= Math.PI/2)
							this.camera.orbit(vec3.fromValues(0, 1, 0), Math.PI/2 - this.cameraRotation);
					else
							this.camera.orbit(vec3.fromValues(0, 1, 0), this.time_elapsed / 1000);
					this.cameraRotation = this.cameraRotation + this.time_elapsed / 1000;
			}
	}
}

MyScene.prototype.cameraHandler = function(string) {
		if (string == "Space")
			this.rotateCamera = true;
};

MyScene.prototype.applyInitTransformations= function(){
	this.initialTransformations['translation'].apply();

	var rotation = this.initialTransformations['rotation'];
	rotation[0].apply();
	rotation[1].apply();
	rotation[2].apply();

	this.initialTransformations['scale'].apply();
};


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
	if (this.lastUpdate != 0) {
		this.time_elapsed = currTime - this.lastUpdate;
		this.timer += (currTime - this.lastUpdate);
	}
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
