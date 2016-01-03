/**
 * GameCamera
 * @constructor
 */


function GameCamera(scene) {
    Object.call(this);
	this.scene = scene;
    this.init();
};

GameCamera.prototype = Object.create(Object.prototype);
GameCamera.prototype.constructor = GameCamera;


GameCamera.prototype.init = function() {
	this.rotateCamera = false;
	this.previousView = "Player1";
    this.currentView = "Player1";
	this.cameraRotation = 0;
};

GameCamera.prototype.getViewAngle = function(view){
    switch(view){
        case "Player1":
            return 0;            
        case "Player2":
            return -Math.PI;
        case "Scoreboard":
            return -Math.PI/2;
        default:
            console.error("There is no angle associated for view: "+view);
            return false;
    }
};

GameCamera.prototype.getRotation=function(){
    prevViewAngle = this.getViewAngle(this.previousView);
    currAngle = this.getViewAngle(this.currentView);

    return currAngle - prevViewAngle;
};

GameCamera.prototype.animateCamera = function() {
	if (this.rotateCamera) {
		var rotation = this.getRotation();

		if (Math.abs(this.cameraRotation) >= Math.abs(rotation)) {
			this.rotateCamera = false;
			this.cameraRotation = 0;
		}
		else {
			var theta = (rotation < 0) ? -this.scene.timeElapsed/1000 : this.scene.timeElapsed / 1000;
			if (Math.abs(this.cameraRotation + theta ) >= Math.abs(rotation))
				this.scene.camera.orbit(vec3.fromValues(0, 1, 0), rotation - this.cameraRotation);
			else
				this.scene.camera.orbit(vec3.fromValues(0, 1, 0),theta);
			this.cameraRotation = this.cameraRotation + theta;
		}
	}
};

GameCamera.prototype.switchViews= function(newView){
    this.previousView = this.currentView;
    this.currentView = newView;
};

GameCamera.prototype.inputHandler = function(key) {
	if(this.rotateCamera){
		return false;
	}

	if (key == "Space"){
		if(this.currentView == "Player1"){
			this.switchViews("Player2");
		}else{
			this.switchViews("Player1");
		}
		this.rotateCamera = true;
	}

	if(key == "R"){
		this.switchViews("Scoreboard");
		this.rotateCamera = true;
	}
};