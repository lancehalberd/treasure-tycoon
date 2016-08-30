
/**
 * Object for tracking and updating a vector on a sphere.
 */
function SphereVector(world){
    this.distance = world.radius;
    //these four vectors should always be orthogonal to eachother,
    //and all of them except position should be normalized
    this.position = new Vector([0, 0, -this.distance]);
    this.positionArray = this.position.getArrayValue();
    this.right = new Vector([1, 0, 0]);
    this.up = new Vector([0, -1, 0]);

    /**
     * Moves this location by the given vectory amount.
     *
     * This is only known to work well when the magnitude of the vector is small
     * relative to the radius of the world.
     *
     * @param {Vector} vector The vector to move by.
     */
    this.moveByVector = function (vector) {
        this.position = this.position.add(vector).normalize(this.distance);
        this.up = this.up.orthoganalize(this.position);
        this.right = this.position.crossProduct3(this.up).normalize(-1);
    };

    /**
     * Returns a vector that is the sum of this vector and the given vector
     *
     * @param {Number} amount  The amount of tangent distant to move
     */
    this.moveUp = function (amount) {
        if (!amount) return;
        //find point on surface closest to current position + forward*amount
        this.position = this.position.add(this.up.scale(amount)).normalize(this.distance);
        this.up = this.up.orthoganalize(this.position);
        this.right = this.position.crossProduct3(this.up).normalize(-1);
        //this.right = this.right.orthoganalize(this.position).orthoganalize(this.up);
    };

    /**
     * Returns a vector that is the sum of this vector and the given vector
     *
     * @param {Number} amount  The amount of tangent distant to move
     */
    this.moveRight = function (amount) {
        if (!amount) return;
        //find point on surface closest to current position + forward*amount
        this.position = this.position.add(this.right.scale(amount)).normalize(this.distance);
        this.right = this.right.orthoganalize(this.position);
        this.up = this.position.crossProduct3(this.right).normalize();
    };

    this.fixRightAndUp = function () {
        // this.up = new Vector([0, 1, 0]).orthoganalize(this.forward).normalize();
        // this.right = this.right.orthoganalize(this.forward).orthoganalize(this.up).normalize();
    };
};