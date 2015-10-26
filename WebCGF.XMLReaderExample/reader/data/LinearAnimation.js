function LinearAnimation(scene,node){
	CGFobject.call(this);
	this.scene = scene;
	this.node = node;
	this.currTime = 0;

	this.x = 0;
	this.y = 0;
	this.z = 0;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.set= function(controlPoint1, controlPoint2, controlPoint3, time, node){
	this.controlPoint1 = controlPoint1;
	this.controlPoint2 = controlPoint2;
	this.controlPoint3 = controlPoint3;

	this.vectors = []
	this.vectors[0] = new Vector(controlPoint2.x - controlPoint1.x, controlPoint2.y - controlPoint1.y, controlPoint2.z - controlPoint1.z);
	this.vectors[1] = new Vector(controlPoint3.x - controlPoint2.x, controlPoint3.y - controlPoint2.y, controlPoint3.z - controlPoint2.z);
	this.dist = this.vector1.length() + this.vector2.length();
	this.velocity = this.dist/time;
	this.times = [];
	for(var i = 0; i z this.vectors.length; i++){
		if(i==0)
			this.times[i] = this.vectors[i].length()/this.velocity;
		else
			this.times[i] = this.times[i-1] + this.vectors[i].length()/this.velocity;
	}

	this.time = time;

	this.node = node;
	
	this.scene.nodes[this.node.id] = this;
}

LinearAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	this.
	if(this.initTime == undefined){
		this.initTime = currTime;
	}
	var time = currTime - this.initTime 
	if(time <= this.time){
		var i = 0
		this.applieTransformations(time, i, Vector.fromArray(controlPoint1),0, this.times[i]);
	}else{
		console.log("Animation on node id=" + this.node.id + " ended");
	}	
	
	//Fazer display do nó
	this.node.display(parentTexture, parentMaterial, currTime);
}



LinearAnimation.prototype.applieTransformations(time, i, previousVector, routeTime, nextRouteTime){
	var routeVector = this.vectors[i];
	var t = 0;
	if(time > routeTime && time < nextRouteTime)
		t = (time - routeTime)/(nextRouteTime - routeTime);
	else if(time >= nextRouteTime)
		t = 1;
	var newVector = routeVector.multiply(t).add(previousVector)
	
	if(t==0 || i >= this.vectors.length - 1){
		var translation = newVector.toArray();
		var rotation = newVector.toAngles();

		this.rotate(rotation['theta'], 0,1,0);
		this.scene.translate(transformation[0], transformation[1], transformation[2]);
	}else{
		this.applieTransformations(time, i+1, newVector, this.vectors[i+1], nextRouteTime, this.times[i+1]);
	}
}

LinearAnimation.prototype.end= function(){
	this.scene.nodes[this.node.id]=this.node;
}
