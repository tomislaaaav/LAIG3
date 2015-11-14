function Animation(scene,id){
	Object.call(this);
	this.scene = scene;
	this.id = id;
}

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;


Animation.prototype.apply= function(currTime){
	
};