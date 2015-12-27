/**
 * Player
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - id of the player (either 1 or 2)
 */
function Player(scene, id) {
    CGFappearance.call(this, scene);

    this.scene = scene;
    this.plane = new Plane(this.scene, 0, 10, 10);

    this.appearance = new CGFappearance(this);
  	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
  	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
  	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
  	this.appearance.setShininess(120);
  	this.appearance.setTexture(this.scene.textures["font_texture"]);

  	this.textShader = new CGFshader(this.scene.gl, "scenes/myScene/shaders/font.vert", "scenes/myScene/shaders/font.frag");
  	this.textShader.setUniformsValues({'dims': [16, 16]});
}

/**
 * Stances that MyMaterial has the properties of a CGFappearance.
*/
Player.prototype = Object.create(CGFappearance.prototype);

/**
 * Creates a MyMaterial.
 */
Player.prototype.constructor = Player;

Player.prototype.display = function () {

  this.scene.pushMatrix();
  this.scene.setActiveShaderSimple(this.textShader);
  this.appearance.apply();

  this.scene.pushMatrix();
  //this.scene.translate(10, 0, 0);
  this.scene.scale(2,2,2);
  this.scene.rotate(Math.PI/2, 1, 0, 0);
  // P
  this.scene.activeShader.setUniformsValues({'charCoords': [0,5]});
  this.plane.display();
  // L
  this.scene.activeShader.setUniformsValues({'charCoords': [12,4]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // A
  this.scene.activeShader.setUniformsValues({'charCoords': [1,4]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // Y
  this.scene.activeShader.setUniformsValues({'charCoords': [9,5]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // E
  this.scene.activeShader.setUniformsValues({'charCoords': [5,4]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // R
  this.scene.activeShader.setUniformsValues({'charCoords': [2,5]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // space
  this.scene.activeShader.setUniformsValues({'charCoords': [2,0]});
  this.scene.translate(1,0,0);
  this.plane.display();
  // id
  if (this.id == 1) {
    this.scene.activeShader.setUniformsValues({'charCoords': [1,3]});
    this.plane.display();
  }
  else {
    this.scene.activeShader.setUniformsValues({'charCoords': [2,3]});
    this.plane.display();
  }
  this.scene.popMatrix();

  this.scene.setActiveShaderSimple(this.scene.defaultShader);
  this.scene.popMatrix();

}
