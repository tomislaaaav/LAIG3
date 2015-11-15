/**
 * Creates a light.
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param an - the animation
 * @param id {string} - the id of the current node
 */
function MyLight(scene, an, id) {
    CGFlight.call(this, scene, an);
    this.id = id;
}

/**
 * Stances that MyLight has the properties of a CGFlight.
*/
MyLight.prototype = Object.create(CGFlight.prototype);

/**
 * Creates an object MyLight.
 */
MyLight.prototype.constructor = MyLight;