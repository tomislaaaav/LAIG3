/**
 * Creates an animation (it acts as an interface).
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the current node
 */
function Animation(scene,id){
	Object.call(this);
	this.scene = scene;
	this.id = id;
}

/**
 * Stances that Animation has the properties of an Object.
*/
Animation.prototype = Object.create(Object.prototype);

/**
 * Creates an Animation object.
 */
Animation.prototype.constructor = Animation;

/**
 * Applies the animations (it acts as an interface).
 */
Animation.prototype.apply= function(currTime){
	
};