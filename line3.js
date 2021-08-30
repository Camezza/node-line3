const vec3 = require(`vec3`);
const valid = /^[xyzXYZ]+$/g;

class Line3 {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.a = new vec3(x1, y1, z1);
        this.b = new vec3(x2, y2, z2);
    }

    /*
    **  Translations
    */

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

    /*
    **  Functions
    */

    xyGradient() {
        return (this.b.y-this.a.y)/(this.b.x-this.a.x);
    }

    zyGradient() {
        return (this.b.y-this.a.y)/(this.b.z-this.a.z);
    }

    xzGradient() {
        return (this.b.z-this.a.z)/(this.b.x-this.a.x);
    }

    yzGradient() {
        return (this.b.z-this.a.z)/(this.b.y-this.a.y);
    }


    xyOffset(gradient) {
        return this.a.y - (gradient || this.xyGradient()) * this.a.x;
    }

    zyOffset(gradient) {
        return this.a.y - (gradient || this.zyGradient()) * this.a.z;
    }

    xzOffset(gradient) {
        return this.a.z - (gradient || this.xzGradient()) * this.a.x;
    }

    yzOffset(gradient) {
        return this.a.z - (gradient || this.yzGradient()) * this.a.y;
    }


    intercept(line) {
        // y=mx+b
        let m1 = this.xyGradient(), m2 = line.xyGradient();
        let b1 = this.xyOffset(m1), b2 = line.xyOffset(m2);
        let x = (b2-b1)/(m1-m2);

        // y=nz+c
        let n1 = this.zyGradient(), n2 = line.zyGradient();
        let c1 = this.zyOffset(n1), c2 = line.zyOffset(n2);
        let z = (c2-c1)/(n1-n2); 

        // determine both values sit on the same line
        let yx = m1*x + b1;
        let yz = n1*z + c1;

        if (yx === yz) {
            let y = yx;

            // determine line restrictions
            let x1Check = (this.a.x <= x && x <= this.b.x) || (this.b.x <= x && x <= this.a.x);
            let y1Check = (this.a.y <= y && y <= this.b.y) || (this.b.y <= y && y <= this.a.y);
            let z1Check = (this.a.z <= z && z <= this.b.z) || (this.b.z <= z && z <= this.a.z);

            let x2Check = (line.a.x <= x && x <= line.b.x) || (line.b.x <= x && x <= line.a.x);
            let y2Check = (line.a.y <= y && y <= line.b.y) || (line.b.y <= y && y <= line.a.y);
            let z2Check = (line.a.z <= z && z <= line.b.z) || (line.b.z <= z && z <= line.a.z);

            if (x1Check && x2Check && y1Check && y2Check && z1Check && z2Check) {
                return new vec3(x, y, z);
            }
        }
        return null;
    }

    // determines where a line intercepts segments of a polygon
    polyIntercept(segments) {
        if (!Array.isArray(segments) && segments.length === 0) throw new TypeError(`Invalid polygon specified. Must be a two-dimensional array of rectangular segments.`);
        let intercepts = [];

        // y=mx+b
        let m = this.xyGradient();
        let b = this.xyOffset(m);

        // y=nz+c
        let n = this.zyGradient()
        let c = this.zyOffset(n)

        for (let rectangle of segments) {
            if (!Array.isArray(rectangle) && !rectangle.length === 6) throw new TypeError(`Invalid polygon segment specified. Must include two groups of consecutive x, y, z values.`);

            // determine if shape surfaces are within the restrictions of the lines in one dimension
            // account for both yx and yz values?

            let xa = rectangle[0], xb = rectangle[3];
            let ya = rectangle[1], yb = rectangle[4];
            let za = rectangle[2], zb = rectangle[5];

            // first, we need to determine that the shape lies between each axis of the line
            // hopefully this can be optimised because 100+ checks per rectangle isn't exactly ideal
            let domX1 = (line.a.x <= xa && xa <= line.b.x) || (line.b.x <= xa && xa <= line.a.x);
            let domX2 = (line.a.x <= xb && xb <= line.b.x) || (line.b.x <= xb && xb <= line.a.x);
            let domY1 = (line.a.y <= ya && ya <= line.b.y) || (line.b.y <= yb && yb <= line.a.y);
            let domY2 = (line.a.y <= yb && yb <= line.b.y) || (line.b.y <= yb && yb <= line.a.y);
            let domZ1 = (line.a.z <= za && za <= line.b.z) || (line.b.z <= za && za <= line.a.z);
            let domZ2 = (line.a.z <= zb && zb <= line.b.z) || (line.b.z <= zb && zb <= line.a.z);

            // ^^^ POSSIBLY REDUNDANT ^^^

            if (domX1 && domX2 && domY1 && domY2 && domZ1 && domZ2) {
                // then, we need to find if the values from subbing the shape domains into the line equations actually fit inside the shapes
                let lineX1 = (ya-b)/m;
                let lineX2 = (yb-b)/m;

                let lineZ1 = (ya-c)/n;
                let lineZ2 = (yb-c)/n;

                // two Y values will be present for both xy and zy planes, for now just check both of them
                let lineYx1 = (m*xa)+b;
                let lineYx2 = (m*xb)+b;

                let lineYz1 = (n*za)+b;
                let lineYz2 = (n*zb)+b;

                domX1 = (xa <= lineX1 && lineX1 <= xb) || (xb <= lineX1 && lineX1 <= xa);
                domX2 = (xa <= lineX2 && lineX2 <= xb) || (xb <= lineX2 && lineX2 <= xa);

                domZ1 = (za <= lineZ1 && lineZ1 <= zb) || (zb <= lineZ1 && lineZ1 <= za);
                domZ2 = (zb <= lineZ2 && lineZ2 <= zb) || (zb <= lineZ2 && lineZ2 <= zb);

                let domYx1 = (ya <= lineYx1 && lineYx1 <= yb) || (yb <= lineYx1 && lineYx1 <= ya);
                let domYx2 = (ya <= lineYx2 && lineYx2 <= yb) || (yb <= lineYx2 && lineYx2 <= ya);

                let domYz1 = (ya <= lineYz1 && lineYz1 <= yb) || (yb <= lineYz1 && lineYz1 <= ya);
                let domYz2 = (ya <= lineYz2 && lineYz2 <= yb) || (yb <= lineYz2 && lineYz2 <= ya);                
            }
        }
    }
}

module.exports = Line3;