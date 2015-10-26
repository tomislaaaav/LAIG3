function LinearAnimation(scene,node){
	CGFobject.call(this);
	this.scene = scene;
	this.node = node;
	this.currTime = 0;
	this.initTime = 0;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.controlState = 0;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.set= function(controlPoint1, controlPoint2, controlPoint3, time, node){
	this.controlPoint1 = controlPoint1;
	this.controlPoint2 = controlPoint2;
	this.controlPoint3 = controlPoint3;


	

	this.route = [];
	this.route['CP2time'] = 

	this.route['CP2dist'] = Math.sqrt(Math.pow(controlPoint2.x, 2)+Math.pow(controlPoint2.y, 2)+Math.pow(controlPoint2.z, 2));
	this.route['CP3dist'] = Math.sqrt(Math.pow((controlPoint3.x - controlPoint2.x), 2) + Math.pow((controlPoint3.y - controlPoint2.y), 2) + Math.pow((controlPoint3.z - controlPoint2.z), 2));
	this.route['time'] = time;
	this.rout['dist'] = this.route.CP2dist + this.route.CP3dist;   
	
	this.node = node;
	
	this.scene.nodes[this.node.id] = this;
}

LinearAnimation.prototype.display= function(parentTexture, parentMaterial, currTime){
	switch(this.controlState){
		case 0:

			break;
		case 1:
			if (this.x == this.controlPoint2.x){
				if (this.y == this.controlPoint2.y){
					if (this.z != this.controlPoint2.z){
						//incrementar z
					}
				}
				else if (this.z == this.controlPoint2.z){
					//incrementar y
				}
				else{
					//incrementar y e z
				}
			}
			else if (this.y == this.controlPoint2.y){
				if (this.z == this.controlPoint2.z){
					//incrementar x
				}
				else{
					//incrementar x e z
				}
			}
			else if (this.z == this.controlPoint2.z){
				//incrementar x e y
			}
			else{
				//incrementar x, y, z
			}
			if (this.x == this.controlPoint2.x && this.y == this.controlPoint2.y && this.z == this.controlPoint2.z){
				controlState = 2;
			}
			break;
		case 2:
			if (this.x == this.controlPoint3.x)
			{
				if (this.y == this.controlPoint3.y)
				{
					if (this.z != this.controlPoint3.z)
					{
						//incrementar z
					}
				}
				else if (this.z == this.controlPoint3.z)
				{
					//incrementar y
				}
				else
				{
					//incrementar y e z
				}
			}
			else if (this.y == this.controlPoint3.y)
			{
				if (this.z == this.controlPoint3.z)
				{
					//incrementar x
				}
				else
				{
					//incrementar x e z
				}
			}
			else if (this.z == this.controlPoint3.z)
			{
				//incrementar x e y
			}
			else
			{
				//incrementar x, y, z
			}

			if (this.x == this.controlPoint3.x && this.y == this.controlPoint3.y && this.z == this.controlPoint3.z)
			{
				controlState = 3;
			}
			break;
		case 3:
			console.log("Animation ended\n");
			//this.endAnimation();
			break;
	}

	
	//aplicar as transformações consoante as alterações feitas previamente
	
	
	//Fazer display do nó
	this.node.display(parentTexture, parentMaterial, currTime);
}


LinearAnimation.prototype.end= function(){
	this.scene.nodes[this.node.id]=this.node;
}
