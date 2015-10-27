function Animation(scene,node){
	Object.call(this);
	this.scene = scene;
	this.node = node;
}

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.display= function(parentTexture, parentMaterial, currTime){

};