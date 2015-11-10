function Animation(scene,id,node){
	Object.call(this);
	this.scene = scene;
	this.id = id;
	this.node = node;
}

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.display= function(parentTexture, parentMaterial, currTime){

};
