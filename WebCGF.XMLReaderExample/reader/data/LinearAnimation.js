function LinearAnimation(scene,id,controlPoints, time){
	Animation.call(this,scene,id);
	this.initTime = null;


	this.controlPoints = controlPoints;


	this.vectors = []
	
	for(var i = 0; i < this.controlPoints.length-1; i++){
		this.vectors[i] = new Vector(this.controlPoints[i+1][0]-this.controlPoints[i][0], this.controlPoints[i+1][1]-this.controlPoints[i][1],this.controlPoints[i+1][2]-this.controlPoints[i][2]);
	}
	
	this.dist = 0;
	for(var i = 0; i < this.vectors.length; i++){
		this.dist += this.vectors[i].length();
	}
	
	this.velocity = this.dist/(time*1e3);
	this.times = [];
	for(var i = 0; i < this.vectors.length; i++){
		if(i==0)
			this.times[i] = this.vectors[i].length()/this.velocity;
		else
			this.times[i] = this.times[i-1] + this.vectors[i].length()/this.velocity;
	}

	this.time = time * 1e3;	
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	Animation.prototype.display.call(parentTexture,parentMaterial,currTime);
	if(this.initTime == null){
		this.initTime = currTime;
	}
	var time = currTime - this.initTime 
	if(time <= this.time){
		this.applyTransformations(time, 0, Vector.fromArray(this.controlPoints[0]),0, this.times[0]);
	}else{
		var i = this.vectors.length-1;
		this.applyTransformations(time, i, Vector.fromArray(this.controlPoints[i]),0, this.times[i]);
	}	
};

LinearAnimation.prototype.apply= function(){
	Animation.prototype.apply.call(this);
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
