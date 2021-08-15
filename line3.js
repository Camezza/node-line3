const vec3 = require(`vec3`);

class Line3 {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.a = new vec3(x1, y1, z1);
        this.b = new vec3(x2, y2, z2);
    }

    offset(x, y, z) {
        return new Line3(this.a.x + x, this.a.y + y, this.a.z + z, this.b.x + x, this.b.y + y, this.b.z + z);
    }

    translate(x, y, z) {
        this.a.add(x, y, z);
        this.b.add(x, y, z);
    }

    minus(x, y, z) {
        return new Line3(this.a.x - x, this.a.y - y, this.a.z - z, this.b.x - x, this.b.y - y, this.b.z - z);
    }

    subtract(x, y, z) {
        this.a.subtract(x, y, z);
        this.b.subtract(x, y, z);
    }

    multiply(x, y, z) {
        return new Line3(this.a.x * x, this.a.y * y, this.a.z * z, this.b.x * x, this.b.y * y, this.b.z * z);
    }

    dilate(x, y, z) {
        this.a.multiply(x, y, z);
        this.b.multiply(x, y, z);
    }

    divide(x, y, z) {
        return new Line3(this.a.x / x, this.a.y / y, this.a.z / z, this.b.x / x, this.b.y / y, this.b.z / z);
    }

    compress(x, y, z) {
        this.a.divide(x, y, z);
        this.b.divide(x, y, z);
    }
    // acts as a circular normal, shifting point B by a specified angle
    rotate(yaw, pitch);
    // intercept with another 3d line
    intercept(line);
}

module.exports = Line3;