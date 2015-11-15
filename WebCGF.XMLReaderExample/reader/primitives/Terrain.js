function Terrain(scene,id, heightmap, colorTexture){
    Object.call(this);
    this.scene = scene;
    this.id = id;
    this.lengthX = lengthX;
    this.lengthZ = lengthZ;

    this.heightmap = heightmap;
    this.colorTexture = colorTexture;

    this.shader = new CGFshader(this.gl, "scenes/myScene/shaders/scene.vert", "scenes/myScene/shaders/scene.frag");

	this.shader.setUniformsValues({uHeightRange: 10.0});
	this.shader.setUniformsValues({uHeightMap: 1});
	this.shader.setUniformsValues({uTexture: 0})	
	
	this.volcano = new Plane(this, "volcano", 256, 256);
};

Terrain.prototype = Object.create(Object.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display= function(){
    this.setActiveShader(this.shader);		
    this.heightmap.bind(1);
    this.colorTexture.bind(0);

    this.volcano.display();
    
    this.heightmap.unbind(1);
    this.colorTexture.unbind(0);
    this.setActiveShader(this.defaultShader);

};
