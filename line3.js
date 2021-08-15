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

    // acts as a circular normal, changing point B by a specified angle and rotating on point A.
    rotate(yaw, pitch) {
        let hRad = Math.sqrt((this.b.z - this.a.z) ** 2 + (this.b.x - this.a.x) ** 2);
        let vRad = Math.sqrt((this.b.y - this.a.y) ** 2 + (this.b.x - this.a.x) ** 2);
        let hAngle = Math.atan2((this.b.z - this.a.z), (this.b.x - this.a.x)) + yaw;
        let vAngle = Math.atan2((this.b.y - this.a.y), (this.b.x - this.a.x)) + pitch;
        return new Line3(this.a.x, this.a.y, this.a.z, Math.cos(hAngle) * hRad, Math.sin(vAngle) * vRad, Math.sin(hAngle) * hRad);
    }

    setRotation(yaw, pitch) {
        let hRad = Math.sqrt((this.b.z - this.a.z) ** 2 + (this.b.x - this.a.x) ** 2);
        let vRad = Math.sqrt((this.b.y - this.a.y) ** 2 + (this.b.x - this.a.x) ** 2);
        let hAngle = Math.atan2((this.b.z - this.a.z), (this.b.x - this.a.x)) + yaw;
        let vAngle = Math.atan2((this.b.y - this.a.y), (this.b.x - this.a.x)) + pitch;
        this.b.x = Math.cos(hAngle) * hRad;
        this.b.y = Math.sin(vAngle) * vRad;
        this.b.z = Math.sin(hAngle) * hRad;
    }

    // intercept with another 3d line
    intercept(line) {

    }
}

module.exports = Line3;