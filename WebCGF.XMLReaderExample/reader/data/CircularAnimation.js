/**
 * Creates a Circular Animation.
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the current node
 * @param center {array} - the center point
 * @param radius {number} - the radius
 * @param alphaInit {number} - the initial rotation
 * @param alpha {number} - the rotation
 * @param time {number} - the span of the animation
 */
function CircularAnimation(scene, id, center, radius, alphaInit, alpha, time){
	Animation.call(this,scene,id);
	this.initTime = null;
	
	this.center = Vector.fromArray(center);
    this.radius = radius;
    this.alphaInit = alphaInit*Math.PI/180;
    this.alpha = alpha*Math.PI/180;
	this.time = time*1e3;

    this.angularVelocity = this.alpha/this.time;
}
/**
 * Stances that CircularAnimation has the properties of an Animation.
*/
CircularAnimation.prototype = Object.create(Animation.prototype);

/**
 * Creates a CircularAnimation object.
 */
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Applies a CircularAnimation to the scene.
 * @param currTime {number} - the current time
 */
CircularAnimation.prototype.apply= function(currTime){
	Animation.prototype.apply.call(this, currTime);
	
	if(this.initTime == null){
		this.initTime = currTime;
	}
	var time = currTime - this.initTime 
	if(time <= this.time){
		this.applyRotation(time);
	}else{
		this.applyRotation(this.time);
	}	

};

/**
 * Applies the rotation to the scene.
 * @param time {number} - the span of the rotation
 */
CircularAnimation.prototype.applyRotation= function(time){
    var inverseTransl = this.center.toArray();
    this.scene.translate(inverseTransl[0],inverseTransl[1],inverseTransl[2]);

	rotation = this.alphaInit+this.angularVelocity*time;
    this.scene.rotate(rotation,0,1,0);
	
	this.scene.translate(this.radius,0,0);

};