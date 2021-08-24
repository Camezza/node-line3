const vec3 = require(`vec3`);

class Line3 {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.a = new vec3(x1, y1, z1);
        this.b = new vec3(x2, y2, z2);
    }

    offset(x, y, z) {
        return new Line3(this.a.x + x, this.a.y + y, this.a.z + z, this.b.x + x, this.b.y + y, this.b.z + z);
    }

    setOffset(x, y, z) {
        this.a.add(x, y, z);
        this.b.add(x, y, z);
    }

    difference(x, y, z) {
        return new Line3(this.a.x - x, this.a.y - y, this.a.z - z, this.b.x - x, this.b.y - y, this.b.z - z);
    }

    setDifference(x, y, z) {
        this.a.subtract(x, y, z);
        this.b.subtract(x, y, z);
    }

    dilate(x, y, z) {
        return new Line3(this.a.x * x, this.a.y * y, this.a.z * z, this.b.x * x, this.b.y * y, this.b.z * z);
    }

    setDilation(x, y, z) {
        this.a.multiply(x, y, z);
        this.b.multiply(x, y, z);
    }

    compress(x, y, z) {
        return new Line3(this.a.x / x, this.a.y / y, this.a.z / z, this.b.x / x, this.b.y / y, this.b.z / z);
    }

    setCompression(x, y, z) {
        this.a.divide(x, y, z);
        this.b.divide(x, y, z);
    }

    /*
        let xzRad = Math.sqrt(difference.x ** 2 + difference.z ** 2);
        let xyRad = Math.sqrt(difference.x ** 2 + difference.y ** 2);
        let zyRad = Math.sqrt(difference.z ** 2 + difference.y ** 2);
    */

    getMatrix() {
        let difference = this.b.minus(this.a);
        let xyzRad = Math.sqrt(difference.x ** 2 + difference.y ** 2 + difference.z ** 2);

        // define axis rotations based on eular axis radius
        let xRotation = Math.asin(difference.y/xyzRad);
        let yRotation = Math.asin(difference.z/xyzRad);
        let zRotation = Math.asin(difference.x/xyzRad);
        return new vec3(xRotation, yRotation, zRotation);
    }

    // acts as a circular normal, changing point B by a specified angle and rotating on point A.
    rotate(x, y, z) {
        let difference = this.b.minus(this.a);
        let xyzRad = Math.sqrt(difference.x ** 2 + difference.y ** 2 + difference.z ** 2);
        let xRotation = Math.asin(difference.y/xyzRad) + x;
        let yRotation = Math.asin(difference.z/xyzRad) + y;
        let zRotation = Math.asin(difference.x/xyzRad) + z;

        return new Line3(this.a.x, this.a.y, this.a.z, xyzRad * Math.sin(xRotation), xyzRad * Math.sin(yRotation), xyzRad * Math.sin(zRotation));
    }

    rotate1(x, y, z) {
        let difference = this.b.minus(this.a);
        let xzRad = Math.sqrt(difference.x ** 2 + difference.z ** 2);
        let xyRad = Math.sqrt(difference.x ** 2 + difference.y ** 2);
        let zyRad = Math.sqrt(difference.z ** 2 + difference.y ** 2);

        // define axis rotations based on eular axis radius
        let xRotation = Math.asin(difference.z/zyRad);
        let yRotation = Math.asin(difference.x/xzRad);
        let zRotation = Math.asin(difference.x/xyRad);

        return new Line3(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z);
    }

    setRotation(yaw, pitch, roll) {
        //https://www.youtube.com/watch?v=lVjFhNv2N8o
        let hRad = Math.sqrt((this.b.z - this.a.z) ** 2 + (this.b.x - this.a.x) ** 2);
        let hAngle = Math.atan2((this.b.z - this.a.z), (this.b.x - this.a.x)) + yaw;
        this.b.x = Math.cos(hAngle) * hRad;
        this.b.z = Math.sin(hAngle) * hRad;
    }

    // intercept with another 3d line
    intercept(line) {

    }
}

module.exports = Line3;