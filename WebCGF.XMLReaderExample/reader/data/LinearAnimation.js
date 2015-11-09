function LinearAnimation(scene,node){
	Animation.call(this,scene, node);
	this.initTime = null;
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.set= function(controlPoint1, controlPoint2, controlPoint3, time){
	this.controlPoint1 = controlPoint1;
	this.controlPoint2 = controlPoint2;
	this.controlPoint3 = controlPoint3;

	this.vectors = []
	this.vectors[0] = new Vector(controlPoint2[0] - controlPoint1[0], controlPoint2[1] - controlPoint1[1], controlPoint2[2] - controlPoint1[2]);
	this.vectors[1] = new Vector(controlPoint3[0] - controlPoint2[0], controlPoint3[1] - controlPoint2[1], controlPoint3[2] - controlPoint2[2]);
	this.dist = this.vectors[0].length() + this.vectors[1].length();
	this.velocity = this.dist/(time*1e3);
	this.times = [];
	for(var i = 0; i < this.vectors.length; i++){
		if(i==0)
			this.times[i] = this.vectors[i].length()/this.velocity;
		else
			this.times[i] = this.times[i-1] + this.vectors[i].length()/this.velocity;
	}

	this.time = time * 1e3;
	
	this.scene.nodes[this.node.id] = this;
}

LinearAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	Animation.prototype.display.call(parentTexture,parentMaterial,currTime);
	if(this.initTime == null){
		this.initTime = currTime;
	}
	this.scene.pushMatrix();
	var time = currTime - this.initTime 
	if(time <= this.time){
		this.applyTransformations(time, 0, Vector.fromArray(this.controlPoint1),0, this.times[0]);
	}else{
		var i = 0;
		this.applyTransformations(time, i, Vector.fromArray(this.controlPoint1),0, this.times[i]);
//		console.log("Animation in node id = " + this.node.id + " ended");
	}	

	
	//Fazer display do nó
	this.node.display(parentTexture, parentMaterial, currTime);
	this.scene.popMatrix();
};



LinearAnimation.prototype.applyTransformations= function(time, i, previousVector, routeTime, nextRouteTime){
	var routeVector = this.vectors[i];
	var t = 0;
	if(time > routeTime && time < nextRouteTime)
		t = (time - routeTime)/(nextRouteTime - routeTime);
	else if(time >= nextRouteTime)
		t = 1;
	var newVector = routeVector.multiply(t).add(previousVector);
	
	if(t < 1 || i >= this.vectors.length - 1){
		var translation = newVector.toArray();
		var rotation = Math.atan2(routeVector.x,routeVector.z);
		this.scene.translate(translation[0], translation[1], translation[2]);
		this.scene.rotate(rotation, 0,1,0);		
		return;
	}else{
		this.applyTransformations(time, i+1, newVector, nextRouteTime, this.times[i+1]);
	}
};

LinearAnimation.prototype.end= function(){
	this.scene.nodes[this.node.id]=this.node;
};
