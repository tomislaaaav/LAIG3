/**
 * Creates a Terrain.
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the node
 * @param heightRange {number} - the range of the height
 * @param heightMap {number} - the map of the height
 * @param colorTexture - the texture
 */ 
function Terrain(scene,id, heightRange, heightmap, colorTexture){
    Object.call(this);
    this.scene = scene;
    this.id = id;
    
    this.heightmap = heightmap;
    this.colorTexture = colorTexture;

    this.shader = new CGFshader(this.scene.gl, "scenes/myScene/shaders/scene.vert", "scenes/myScene/shaders/scene.frag");

	this.shader.setUniformsValues({uHeightRange: heightRange});
	this.shader.setUniformsValues({uHeightMap: 1});
	this.shader.setUniformsValues({uTexture: 0})	
	
	this.volcano = new Plane(this.scene, "volcano", 256, 256);
};

/**
 * Stances that Terrain has the properties of an Object.
*/
Terrain.prototype = Object.create(Object.prototype);

/**
 * Creates a Terrain object.
 */
Terrain.prototype.constructor = Terrain;

/**
 * Displays the terrain, through shaders.
 */
Terrain.prototype.display= function(){
    this.scene.setActiveShader(this.shader);		
    this.heightmap.bind(1);
    this.colorTexture.bind(0);

    this.volcano.display();

    this.heightmap.unbind(1);
    this.colorTexture.unbind(0);
    this.scene.setActiveShader(this.scene.defaultShader);

};
