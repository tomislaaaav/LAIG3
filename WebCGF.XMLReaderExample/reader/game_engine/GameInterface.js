/**
 * GameInterface
 * @constructor
 */
 
 
function GameInterface(scene) {
	//call CGFinterface constructor 
	CGFinterface.call(this);
	this.scene = scene;
};

GameInterface.prototype = Object.create(CGFinterface.prototype);
GameInterface.prototype.constructor = GameInterface;

/**
 * init
 * @param {CGFapplication} application
 */
GameInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();
    
    this.gui.add(this.scene, 'NewGamePVP');
    this.gui.add(this.scene, 'NewGameBot');
	this.gui.add(this.scene, 'Undo');	
		
    var group=this.gui.addFolder("Definitions");
	group.open();
	
	group.add(this.scene, 'botDifficulty', this.scene.botDiffList);
    group.add(this.scene, 'turnDuration', 5,30);
    group.add(this.scene, 'boardX', 5,15);
    group.add(this.scene, 'boardY', 5,15);


	return true;
};
