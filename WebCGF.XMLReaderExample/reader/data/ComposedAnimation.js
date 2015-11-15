/**
 * Creates a ComposedAnimation.
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the current node
 */
function ComposedAnimation(scene, id){
	Animation.call(this,scene,id);
	this.animations = [];
}

/**
 * Stances that ComposedAnimation has the properties of an Animation.
*/
ComposedAnimation.prototype = Object.create(Animation.prototype);

/**
 * Creates a Composed Animation.
 */
ComposedAnimation.prototype.constructor = ComposedAnimation;

/**
 * Applies all of the animations.
 */
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

/**
 * Adds a new animation.
 * @param animation {Animation} - the animation to be added
 * @param initTime {number} - the time of the new animation
 */
ComposedAnimation.prototype.addAnimation= function(animation, initTime){
  var newAnim = [];
  newAnim.id = animation.id;
  newAnim.animation = animation;
  newAnim.initTime = initTime*1e3;
  this.animations.push(newAnim);  
};