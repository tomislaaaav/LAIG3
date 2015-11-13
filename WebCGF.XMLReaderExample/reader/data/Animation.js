function Animation(scene,id){
	Object.call(this);
	this.scene = scene;
	this.id = id;
}

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.display= function(parentTexture, parentMaterial, currTime){

};


Animation.prototype.apply= function(){
	//this.scene.nodes[this.node.id] = this;
};