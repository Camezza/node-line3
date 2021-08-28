const vec3 = require(`vec3`);
const valid = /^[xyzXYZ]+$/g;

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
    rotateMatrix(matrix, order) {
        let axis = order.match(valid);
        let length = this.a.distanceTo(this.b);
        let radius = Math.sqrt(length ** 2 / 3);
        let x = radius, y = radius, z = radius;

        // verify we have the correct data
        if (!Array.isArray(matrix) || matrix.length === 0) throw new TypeError(`Invalid matrix specified. Must be an array of at least 1 Eucledian angle(s).`);
        if (!axis) throw new TypeError(`Invalid order specified. Must be a string containing at least one concatenated xyz value.`);
        if (matrix.length !== axis[0].length) throw new Error(`Matrix length must match the order length.`);

        for (let i = 0, il = axis[0].length; i < il; i++) {
            let xo = x, yo = y, zo = z;
            if (axis[0][i] === 'x') {
                z = zo * Math.cos(matrix[i]) - yo * Math.sin(matrix[i]);
                y = zo * Math.sin(matrix[i]) + yo * Math.cos(matrix[i]);
            }

            else if (axis[0][i] === 'y') {
                x = xo * Math.cos(matrix[i]) - zo * Math.sin(matrix[i]);
                z = xo * Math.sin(matrix[i]) + zo * Math.cos(matrix[i]);
            }

            else if (axis[0][i] === 'z') {
                y = yo * Math.cos(matrix[i]) - xo * Math.sin(matrix[i]);
                x = yo * Math.sin(matrix[i]) + xo * Math.cos(matrix[i]);
            }
        }
        return new Line3(this.a.x, this.a.y, this.a.z, this.a.x + x, this.a.y + y, this.a.z + z);
    }

    setMatrix(matrix, order) {
        let axis = order.match(valid);
        let length = this.a.distanceTo(this.b);
        let radius = Math.sqrt(length ** 2 / 3);
        let x = radius, y = radius, z = radius;

        // verify we have the correct data
        if (!Array.isArray(matrix) || matrix.length === 0) throw new TypeError(`Invalid matrix specified. Must be an array of at least 1 Eucledian angle(s).`);
        if (!axis) throw new TypeError(`Invalid order specified. Must be a string containing at least one concatenated xyz value.`);
        if (matrix.length !== axis[0].length) throw new Error(`Matrix length must match the order length.`);

        for (let i = 0, il = axis[0].length; i < il; i++) {
            let xo = x, yo = y, zo = z;
            if (axis[0][i] === 'x') {
                z = zo * Math.cos(matrix[i]) - yo * Math.sin(matrix[i]);
                y = zo * Math.sin(matrix[i]) + yo * Math.cos(matrix[i]);
            }

            else if (axis[0][i] === 'y') {
                x = xo * Math.cos(matrix[i]) - zo * Math.sin(matrix[i]);
                z = xo * Math.sin(matrix[i]) + zo * Math.cos(matrix[i]);
            }

            else if (axis[0][i] === 'z') {
                y = yo * Math.cos(matrix[i]) - xo * Math.sin(matrix[i]);
                x = yo * Math.sin(matrix[i]) + xo * Math.cos(matrix[i]);
            }
        }
        this.b.x = this.a.x + x;
        this.b.y = this.a.y + y;
        this.b.z = this.a.z + z;
    }
}

module.exports = Line3;