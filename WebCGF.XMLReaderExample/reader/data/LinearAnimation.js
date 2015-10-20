function LinearAnimation(scene,node){
	CGFobject.call(this);
	this.scene = scene;
	this.node = node;
	this.currTime = 0;
	this.initTime = 0;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.set= function(controlPoint1, controlPoint2, controlPoint3, time, node){
	this.controlPoint1 = controlPoint1;
	this.controlPoint2 = controlPoint2;
	this.controlPoint3 = controlPoint3;
	this.time = time;
	
	this.node = node;
	
	this.scene.nodes[this.node.id] = this;
}

LinearAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	//Aplicar alterações necessárias para o tempo
	this.currTime = currTime;
	switch(currTime - this.initTime){
		case currTime:
			this.initTime = currTime;
			break;
		case this.time:
			break;
		default:
			var deltaT = currTime - this.currTime;
			break;
	}
	
	//aplicar as transformações consoante as alterações feitas previamente
	
	
	//Fazer display do nó
	this.node.display(parentTexture, parentMaterial, currTime);
}

