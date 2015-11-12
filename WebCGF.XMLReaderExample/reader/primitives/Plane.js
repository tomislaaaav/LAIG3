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

Plane.prototype = Object.create(Object.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.display= function(parentTexture, parentMaterial, currTime){
    this.nurbsObject.display();
};

/**
 * Scales the texCoords according to the s and t amplification factor.
 */
Plane.prototype.scaleTexCoords = function(ampS, ampT) {
    this.updateTexCoordsGLBuffers();
};