
function Vector(v){

    for (var i = 0; i < v.length; i++) {
        v[i] = fixFloat(v[i]);
    }

    /**
     * Returns a vector that is the sum of this vector and the given vector
     *
     * @param {Vector} vector  The vector to add to this vector
     * @returns {Vector} The resulting vector.
     */
    this.add = function (vector) {
        var u = vector.getArrayValue();
        var r = [];
        for (var i = 0; i < v.length; i++) {
            r[i] = v[i] + u[i];
        }
        return new Vector(r);
    }

    /**
     * Returns a vector that is the difference of this vector and the given vector
     *
     * @param {Vector} vector  The vector to subtract from this vector
     * @returns {Vector} The resulting vector.
     */
    this.subtract = function (vector) {
        var u = vector.getArrayValue();
        var r = [];
        for (var i = 0; i < v.length; i++) {
            r[i] = v[i] - u[i];
        }
        return new Vector(r);
    }

    /**
     * Returns a vector that is this vector scaled by the given amount
     *
     * @param {Number} scaler  The amount to scale this vector by
     * @returns {Vector} The resulting vector.
     */
    this.scale = function (scaler) {
        var r = [];
        for (var i = 0; i < v.length; i++) {
            r[i] = v[i] * scaler;
        }
        return new Vector(r);
    }

    /**
     * Returns the length of this vector
     *
     * @returns {Number} The length of this vector
     */
    this.magnitude = function () {
        var lengthSquared = 0;
        for (var i = 0; i < v.length; i++) {
            lengthSquared += v[i] * v[i];
        }
        return Math.sqrt(lengthSquared);
    }

    /**
     * Returns the length of this vector
     *
     * @returns {Number} The length of this vector
     */
    this.magSquared = function () {
        var lengthSquared = 0;
        for (var i = 0; i < v.length; i++) {
            lengthSquared += v[i] * v[i];
        }
        return lengthSquared;
    }

    /**
     * Returns a vector that has the same direction as this vector and the given
     * length, or 1 if no length is provided.
     *
     * @returns {Vector} The normalized version of this vector
     */
    this.normalize = function (length) {
        if (length === undefined) {
            length = 1;
        }
        return this.scale(length / this.magnitude());
    }

    /**
     * Returns the dot product of this vector and the given vector
     *
     * @param {Vector} vector  The vector to make the new vector orthogonal to
     * @returns {Number} The dot product of the vectors
     */
    this.dotProduct = function (vector) {
        var u = vector.getArrayValue();
        var dotProduct = 0;
        for (var i = 0; i < v.length; i++) {
            dotProduct += v[i] * u[i];
        }
        return dotProduct;
    }

    /**
     * Returns a vector that is in the same plain as this vector and the given
     * vector but that is perpendicular to the given vector
     *
     * @param {Vector} vector  The vector to make the new vector orthogonal to
     * @returns {Vector}  The resulting vector
     */
    this.orthoganalize = function (vector) {
        //vector.normalize(self.dotProduct(vector.normalize())) is the projection of this vector
        //onto the given vector. Subtracting it from this vector results in a
        //vector that has a 0 length projection onto the given vector, meaning
        //this new vector is orthogonal to the given vector.
        //Since the whole formula is a linear combination of only these two
        //vectors, the result must lie in the same plane as both vectors
        /*console.log("Making " + this.getArrayValue() + " ortho to "+ vector.getArrayValue());
        console.log("dotProduct "+this.dotProduct(vector.normalize()));
        console.log("projection onto vector " + vector.normalize(this.dotProduct(vector.normalize())).getArrayValue());
        var result = this.subtract(vector.normalize(this.dotProduct(vector.normalize())));
        console.log("difference " + result.getArrayValue());
        console.log("new dot product: "+ result.dotProduct(vector));*/
        return this.subtract(vector.normalize(this.dotProduct(vector.normalize())));
    }

    /**
     * Returns a vector that is the product of matrix*this vector.
     * For left multiplication to be valid, the given matrix must have the
     * same number of columns that this vector has. The result has
     * dimensionality equal to the number of rows of the matrix
     *
     * @param {Array}  The matrix as a 2D array
     * @returns {Vector}  The resulting vector
     */
    this.leftMultiply = function (matrix) {
        var r = [];
        for (var row = 0; row < matrix.length; row++) {
            r[row] = 0;
            for (var col = 0; col < matrix[row].length; col++) {
                r[row] += matrix[row][col] * v[col];
            }
        }
        return new Vector(r);
    }

    /**
     * Returns the array this vector object wraps
     *
     * @returns {Array}  The array representation of this vector
     */
    this.getArrayValue = function () {
        return v.slice();
    }

    /**
     * Returns true if this vector is identical to the given vector
     *
     * @returns {Boolean}  True if the two vectors are equal
     */
    this.equals = function (vector) {
        var u = vector.getArrayValue();
        if (u.length != v.length) {
            return false;
        }
        for (var i = 0; i < v.length; i++) {
            if (v[i] != u[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Gets the nth coordinate of this vector
     *
     * @return {Number}  The coordinate requested
     */
    this.getCoordinate = function (index) {
        return v[index];
    }

    /**
     * Sets the nth coordinate of this vector
     *
     * @return {Vector}  This vector, for chaining.
     */
    this.setCoordinate = function (index, value) {
        v[index] = value;
        return this;
    }

    /**
     * Returns a vector that is the result of concatenating it with a second
     * vector.
     *
     * @param {Vector} vector  The vector to augment this vector with
     * @returns {Vector}  The resulting vector
     */
    this.augment = function (vector) {
        return new Vector(this.getArrayValue().concat(vector.getArrayValue()));
    };

    this.crossProduct3 = function (vector) {
        var v2 = vector.getArrayValue();
        return new Vector([v[1]*v2[2] - v[2]*v2[1], -(v[0]*v2[2] - v[2]*v2[0]), v[0]*v2[1] - v[1]*v2[0]]);
    };

};