function Patch(scene,id,orderU, orderV,divsU,divsV,controlPoints){
    Object.call(this);


    var knotsU;
    switch(orderU){
        case 1:
           knotsU = [0, 0, 1, 1];
           break;
        case 2:
           knotsU = [0, 0, 0, 1, 1, 1];
           break;
        case 3:
            knotsU = [0, 0, 0, 0, 1, 1, 1, 1];
            break;
        default:
            console.error("orderU needs to be between 1 and 3.");
            return;
    }

    var knotsV;
    switch(orderV){
        case 1:
           knotsV = [0, 0, 1, 1];
           break;
        case 2:
           knotsV = [0, 0, 0, 1, 1, 1];
           break;
        case 3:
            knotsV = [0, 0, 0, 0, 1, 1, 1, 1];
            break;
        default:
            console.error("orderV needs to be between 1 and 3.");
            return;
    }
    

    if(controlPoints.length != orderU+1){
        console.error("controlPoints.length is"+controlPoints.length+". Expected "+(orderU+1)+"." );
        return;
    }
    for(var i = 0; i < controlPoints; i++){
        if(controlPoints[i].length != orderV+1){
            console.error("controlPoints["+i+"].length is"+controlPoints[i].length+". Expected "+(orderV+1)+"." );
            return;
        }
    }
    
    var nurbsSurface = new CGFnurbsSurface(orderU,orderV, knotsU,knotsV, controlPoints);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, divsU,divsV); 
};

Patch.prototype = Object.create(Object.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.display= function(parentTexture, parentMaterial, currTime){
    this.nurbsObject.display();
};
/**
 * Scales the texCoords according to the s and t amplification factor.
 */
Patch.prototype.scaleTexCoords = function(ampS, ampT) {
    this.updateTexCoordsGLBuffers();
};