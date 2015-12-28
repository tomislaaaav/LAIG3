/**
 * ScoreBoard
 * @constructor
 * @param scene {CGFscene} - the scene
 */
function ScoreBoard(scene, title) {
    CGFappearance.call(this, scene);

    this.scene = scene;

    this.plane = new MyRectangle(this.scene, 0, 1, 1, 0);
    this.plane.scaleTexCoords(1, 1);

    this.timeMinutes = "00";
    this.timeSeconds = "00";

    this.player1Points = "00";
    this.player2Points = "00";

	if(title == null){
		this.gameTitle = "SPANGLES";
	}else{
		this.gameTitle = title;
	}
    this.turn = "00";

	this.time = null;

	this.background = this.scene.nodes['scoreboard_background'];

    this.appearance = new CGFappearance(this);
  	this.appearance.setAmbient(1, 0, 0, 1);
  	this.appearance.setDiffuse(1, 0, 0, 1);
  	this.appearance.setSpecular(1, 0, 0, 1);
  	this.appearance.setShininess(120);
  	this.appearance.setTexture(this.scene.textures["font_texture"]);

  	this.textShader = new CGFshader(this.scene.gl, "scenes/myScene/shaders/font.vert", "scenes/myScene/shaders/font.frag");
  	this.textShader.setUniformsValues({'dims': [16, 16]});
};

/**
 * Stances that MyMaterial has the properties of a CGFappearance.
*/
ScoreBoard.prototype = Object.create(CGFappearance.prototype);

/**
 * Creates a MyMaterial.
 */
ScoreBoard.prototype.constructor = ScoreBoard;


ScoreBoard.prototype.updateTime= function(time){
	if(this.time == null){
		this.time = time;
	}

	var seconds_passed = (time-this.time)*1e-3;
	
	var minutes = Math.floor(seconds_passed / 60);
	if(minutes > 100)
		minutes = Math.floor(minutes/100);
	var seconds = seconds_passed % 60;
	
	this.time_seconds = (seconds < 10) ? ("0"+seconds) : (seconds+"") ;
	this.time_minutes = (minutes < 10) ? ("0"+minutes) : (minutes + "");

};

ScoreBoard.prototype.resetTimer= function(){
	this.time = null;
}

ScoreBoard.prototype.updateTurn=function(time){
	this.turn = (time < 10)? ("0"+time) : (""+time);
}

ScoreBoard.prototype.setPlayer1Points = function (points) {
  this.player1Points = ""+points;
};

ScoreBoard.prototype.setPlayer2Points = function (points) {
  this.player2Points = ""+points;
};

ScoreBoard.prototype.display = function () {	
	this.scene.pushMatrix();
		this.scene.scale(0.5, 0.5, 0.5);		
		this.scene.setActiveShaderSimple(this.textShader);
		this.appearance.apply();
		this.scene.pushMatrix();
			this.scene.translate(0,0,0.1);
			this.scene.pushMatrix();
				this.scene.translate(-4, 5, 0);
				this.createSentence(this.gameTitle);
			this.scene.popMatrix();	

			this.scene.pushMatrix();
				  this.scene.translate(-2, 2.5, 0);
				  this.createSentence("TIME");
			this.scene.popMatrix();

			this.displayTime();
			this.displayThirdDivision();
		this.scene.popMatrix();

	  	this.scene.setActiveShaderSimple(this.scene.defaultShader);


	  	this.scene.pushMatrix();
			this.scene.scale(30,15,1);
			this.background.display();
		this.scene.popMatrix();
  	this.scene.popMatrix();
};

ScoreBoard.prototype.createSentence = function (string) {
	for(var i = 0; i < string.length;i++) {
		var letter = string.charAt(i);

		var coord = this.getCoordArray(letter);

		this.scene.pushMatrix();
			this.scene.activeShader.setUniformsValues({'charCoords': coord});
			this.scene.activeShader.setUniformsValues({'color': vec4.fromValues(1, 0, 0, 1)});
			this.plane.display();
		this.scene.popMatrix();

		if (i + 1 != string.length)
			this.scene.translate(1,0,0);
	}
};

ScoreBoard.prototype.displayTime= function(){
	this.scene.pushMatrix();
		this.scene.scale(2, 2, 1);
		this.scene.translate(-2.37, 0, 0);
		this.createSentence(this.timeMinutes + ":" + this.timeSeconds);
	this.scene.popMatrix();
};

ScoreBoard.prototype.displayThirdDivision=function(){
	this.scene.pushMatrix();
		this.scene.translate(-13,-2,0);

		// jogador 1
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 0);
			this.createSentence("PLAYER 1");
	
			this.displayFourthDivisionElement(this.player1Points);
		this.scene.popMatrix();
		

		// turn
		this.scene.pushMatrix();
			this.scene.translate(11, 0, 0);
			this.createSentence("TURN");
			this.scene.translate(2.2,0,0);
			this.displayFourthDivisionElement(this.turn);
		this.scene.popMatrix();


		// jogador 2
		this.scene.pushMatrix();
			this.scene.translate(19, 0, 0); 
			this.createSentence("PLAYER 2");
			this.displayFourthDivisionElement(this.player2Points);
		this.scene.popMatrix();	

	this.scene.popMatrix();
};

ScoreBoard.prototype.displayFourthDivisionElement= function(element){
	var pointsSize = 4;
	this.scene.pushMatrix();
		this.scene.scale(pointsSize, pointsSize, 1);
		this.scene.translate(-1.75, -1, 0);
		this.createSentence(element);
	this.scene.popMatrix();

};

ScoreBoard.prototype.getCoordArray = function(Char){

	switch(Char) {
	case 'A':
		return new Array(1,4);
		break;
	case 'B':
		return new Array(2,4);
		break;
	case 'C':
		return new Array(3,4);
		break;
	case 'D':
		return new Array(4,4);
		break;
	case 'E':
		return new Array(5,4);
		break;
	case 'F':
		return new Array(6,4);
		break;
	case 'G':
		return new Array(7,4);
		break;
	case 'H':
		return new Array(8,4);
		break;
	case 'I':
		return new Array(9,4);
		break;
	case 'J':
		return new Array(10,4);
		break;
	case 'K':
		return new Array(11,4);
		break;
	case 'L':
		return new Array(12,4);
		break;
	case 'M':
		return new Array(13,4);
		break;
	case 'N':
		return new Array(14,4);
		break;
	case 'O':
		return new Array(15,4);
		break;
	case 'P':
		return new Array(0,5);
		break;
	case 'K':
		return new Array(1,5);
		break;
	case 'R':
		return new Array(2,5);
		break;
	case 'S':
		return new Array(3,5);
		break;
	case 'T':
		return new Array(4,5);
		break;
	case 'U':
		return new Array(5,5);
		break;
	case 'V':
		return new Array(6,5);
		break;
	case 'W':
		return new Array(7,5);
		break;
	case 'X':
		return new Array(8,5);
		break;
	case 'Y':
		return new Array(9,5);
		break;
	case 'Z':
		return new Array(10,5);
		break;
	case '0':
		return new Array(0,3);
		break;
	case '1':
		return new Array(1,3);
		break;
	case '2':
		return new Array(2,3);
		break;
	case '3':
		return new Array(3,3);
		break;
	case '4':
		return new Array(4,3);
		break;
	case '5':
		return new Array(5,3);
		break;
	case '6':
		return new Array(6,3);
		break;
	case '7':
		return new Array(7,3);
		break;
	case '8':
		return new Array(8,3);
		break;
	case '9':
		return new Array(9,3);
		break;
	case ' ':
		return new Array(0,2);
		break;
	case ':':
		return new Array(10,3);
		break;
	}
};
