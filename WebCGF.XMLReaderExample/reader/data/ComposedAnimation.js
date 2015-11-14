function ComposedAnimation(scene, id){
	Animation.call(this,scene,id);
	this.animations = [];
}

ComposedAnimation.prototype = Object.create(Animation.prototype);
ComposedAnimation.prototype.constructor = ComposedAnimation;

ComposedAnimation.prototype.apply= function(currTime){
	Animation.prototype.apply.call(this, currTime);
	
	if(this.initTime == null){
		this.initTime = currTime;
	}
	var time = currTime - this.initTime 
	for(var i = 0; i < this.animations.length; i++){
	    if(time >= this.animations[i].initTime){
	        this.animations[i].animation.apply(currTime);
	    }
	}
};


ComposedAnimation.prototype.addAnimation= function(animation, initTime){
  var newAnim = [];
  newAnim.id = animation.id;
  newAnim.animation = animation;
  newAnim.initTime = initTime*1e3;
  this.animations.push(newAnim);  
};