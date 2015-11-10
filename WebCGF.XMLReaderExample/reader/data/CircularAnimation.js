function CircularAnimation(scene,id,node){
	Animation.call(this,scene,id,node);
	this.initTime = null;
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;


CircularAnimation.prototype.set= function(center,radius, alphaInit, alpha, time){    
    this.center = Vector.fromArray(center);
    this.radius = radius;
    this.alphaInit = alphaInit*Math.PI/180;
    this.alpha = alpha*Math.PI/180;
	this.time = time*1e3;

    this.angularVelocity = this.alpha/this.time;

	this.scene.nodes[this.node.id] = this;
}

CircularAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	Animation.prototype.display.call(parentTexture,parentMaterial,currTime);
	
	if(this.initTime == null){
		this.initTime = currTime;
	}
	this.scene.pushMatrix();
	var time = currTime - this.initTime 
	if(time <= this.time){
		this.applyRotation(time);
	}else{
		this.applyRotation(this.time);
	}	

	this.node.display(parentTexture, parentMaterial, currTime);
	this.scene.popMatrix();
};



CircularAnimation.prototype.applyRotation= function(time){
    var inverseTransl = this.center.toArray();
    this.scene.translate(inverseTransl[0],inverseTransl[1],inverseTransl[2]);

	rotation = this.alphaInit+this.angularVelocity*time;
    this.scene.rotate(rotation,0,1,0);
	
	this.scene.translate(this.radius,0,0);

};

CircularAnimation.prototype.end= function(){
	this.scene.nodes[this.node.id]=this.node;
};