function Animation(scene,node){
	CGFobject.call(this);
	this.scene = scene;
	this.node = node;
}

Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;


Animation.prototype.apply= function(controlPoint1, controlPoint2, controlPoint3, time);

Animation.prototype.display= function();