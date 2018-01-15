
/**
 *
 * @param {World} world  The world the camera is part of
 */
function Camera(world, screenWidth, screenHeight){

    this.distance = world.radius * 2;

    //these four vectors should always be orthogonal to eachother,
    //and all of them except position should be normalized
    this.position = new Vector([0, 0, -this.distance]);
    this.positionArray = this.position.getArrayValue();
    this.right = new Vector([1, 0, 0]);
    this.up = new Vector([0, 1, 0]);
    this.forward = new Vector([0, 0, 1]);
    this.eye = {width: 5, height: 3.5, length: 3};

    //this is updated by this.updateRotationMatrix
    this.rotationMatrix = null;

    this.fixRightAndUp = function () {
        this.up = this.up.orthoganalize(this.forward).normalize();
        //this.up = new Vector([0, -1, 0]).orthoganalize(this.forward).normalize();
        this.right = this.right.orthoganalize(this.forward).orthoganalize(this.up).normalize();
    };

    /**
     * Projects a point onto the eye, resulting in coordinates that hit the
     * eye mapping to ([0,1], [0,1])
     *
     * @param {Vector} point  The point to project
     */
    this.projectPoint = function (point) {
        // We translate the point and rotate it so that it is in a coordinate system that puts the camera at (0, 0, 0) facing (0, 0, 1).
        // In that system, one can simply scale the x, y coordinates by the ratio of the lens length over the z coordinate to get the projected coordinates.
        //log("projecting");
        //log(point);
        var translated = new Vector([point[0] - this.positionArray[0], point[1] - this.positionArray[1], point[2] - this.positionArray[2]]);
        //log(translated.getArrayValue());
        var rotated = translated.leftMultiply(this.rotationMatrix);
        //log(rotated.getArrayValue());
        //logging = false;
        //console.log(rotated.getArrayValue());
        return rotated.getArrayValue();
        /*var z = rotated.getCoordinate(2);
        // points on the plane orthogonal to the direction we are facing cannot be projected
        // as lines from the camera position to these points are parallel to the lens.
        if (z < this.eye.length) {
            return false;
        }
        var scale = this.eye.length / z;
        var x = rotated.getCoordinate(0);
        var y = .5 + scale * rotated.getCoordinate(1) / this.eye.height;
        return [rotated.getCoordinate(0), rotated.getCoordinate(1), z];*/
    };

    this.unprojectPoint = function (x, y, radius) {
        var z = -Math.sqrt(radius * radius - x * x - y * y);
        var v = this.right.scale(x).add(this.up.scale(y)).add(this.forward.scale(z));
        return v.getArrayValue();
    }

    this.mapToSphere = function (point, radius) {
        var x = point[0] / screenWidth;
        var y = (screenHeight - point[1]) / screenHeight;
        var scale = this.eye.length / 10;
        var p = new Vector([(x - .5) * this.eye.width / scale, (y - .5) * this.eye.height / scale, 10]);
        var v = this.right.scale(p.getCoordinate(0)).add(this.up.scale(p.getCoordinate(1))).add(this.forward.scale(p.getCoordinate(2)));
        var A = v.magSquared();
        var B = 2 * (v.dotProduct(this.position));
        var C = this.position.magSquared() - radius * radius;
        var descriminate = B*B - 4*A*C;
        if (descriminate < 0) {
            return false;
        }
        var t1 = (-B + Math.sqrt(descriminate)) / (2 * A);
        var t2 = (-B - Math.sqrt(descriminate)) / (2 * A);
        var t = Math.min(t1, t2);
        return this.position.add(v.scale(t));
    };

    this.updateRotationMatrix = function () {
        //get orthonormal matrix representing the current orientation
        var matrix = [
            this.right.augment(new Vector([1,0,0])),
            this.up.augment(new Vector([0,1,0])),
            this.forward.augment(new Vector([0,0,1]))
        ];
        for (var col = 0; col < 3; col++) {
            var safety = 0;
            while (matrix[col].getCoordinate(col) == 0 && safety++<10) {
                matrix = matrix.concat(matrix.splice(col, 1));
            }
            if (safety >= 10) {
                console.log("infinite loop error");
                return;
            }
            //scale so that the leading value is 1
            matrix[col] = matrix[col].scale(1 / matrix[col].getCoordinate(col));
            //set the rest of the column to be 0
            for (var row = 0; row < 3; row++) {
                if (row == col) {
                    continue;
                }
                matrix[row] = matrix[row].subtract(matrix[col].scale(matrix[row].getCoordinate(col)));
            }
        }
        this.rotationMatrix = [
            matrix[0].getArrayValue().splice(3,3),
            matrix[1].getArrayValue().splice(3,3),
            matrix[2].getArrayValue().splice(3,3)
        ];
        //transpose matrix
        for (var col = 0; col < 3; col++) {
            for (var row = col + 1; row < 3; row++) {
                var temp = this.rotationMatrix[row][col];
                this.rotationMatrix[row][col] = this.rotationMatrix[col][row];
                this.rotationMatrix[col][row] = temp;
            }
        }
        this.positionArray = this.position.getArrayValue();
    };
};