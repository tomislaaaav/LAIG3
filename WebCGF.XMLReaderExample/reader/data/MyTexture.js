/**
 * MyTexture
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the current node
 * @param path {string} - the path of the texture used
 * @param s {number} - the scale on s
 * @param t {number} - the scale on t
 */
function MyTexture(scene, id, path, s, t) {
    CGFtexture.call(this, scene,path);

    this.id = id;
    this.s = s;
    this.t = t;
}

/**
 * Stances that MyTexture has the properties of a CGFtexture.
*/
MyTexture.prototype = Object.create(CGFtexture.prototype);

/**
 * Creates a MyTexture.
 */
MyTexture.prototype.constructor = MyTexture;