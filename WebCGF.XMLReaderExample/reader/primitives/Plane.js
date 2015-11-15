/**
 * Creates a Plane.
 * @constructor
 * @param scene {CGFscene} - the scene
 * @param id {string} - the id of the current node
 * @param divsU {number} - the number of the divisions in U
 * @param divsV {number} - the number of the divisions in V
 */
function Plane(scene,id,divsU,divsV){
	Object.call(this);
	this.id =id;
	this.scene = scene;
	this.divsU = divsU;
	this.divsV = divsV;


    var knotsU = [0,0,1,1];
    var knotsV = [0,0,1,1];

    
    var partsU = 1;
    var partsV = 1;
	var controlPoints = [
                            [
                                [0.5,0,-0.5,1],
                                [0.5,0,0.5,1]
                            ],

                            [
                                [-0.5,0,-0.5,1],
                                [-0.5,0,0.5,1]
                            ]

	                       ];
    var nurbsSurface = new CGFnurbsSurface(partsU,partsV, knotsU,knotsV, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, divsU,divsV);
    
}

/**
 * Stances that Plane has the properties of an Object.
*/
Plane.prototype = Object.create(Object.prototype);

/**
 * Creates a Plane object.
 */
Plane.prototype.constructor = Plane;

/**
 * Displays the plane through Nurbs.
 */
Plane.prototype.display= function(parentTexture, parentMaterial, currTime){
    this.nurbsObject.display();
};

/**
 * Scales the texCoords according to the s and t amplification factor.
 */
Plane.prototype.scaleTexCoords = function(ampS, ampT) {
    this.updateTexCoordsGLBuffers();
};