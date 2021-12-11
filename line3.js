const vec3 = require(`vec3`);
const assert = require(`assert`);

class Line3 {
    constructor(x1, y1, z1, x2, y2, z2, matrix) {
        this.a = new vec3(x1, y1, z1);
        this.b = new vec3(x2, y2, z2);
        this._matrix = matrix || new vec3(0, 0, 0);
    }

    static fromVec3(a, b, matrix) {
        return new Line3(a.x, a.y, a.z, b.x, b.y, b.z, matrix);
    }

    get matrix() {
        return this._matrix;
    }

    /*
    **  Translations
    */

   instance() {
       return this.fromVec3(this.a, this.b, this._matrix);
   }

    offset(x, y, z) {
        return new Line3(this.a.x + x, this.a.y + y, this.a.z + z, this.b.x + x, this.b.y + y, this.b.z + z);
    }

    setOffset(x, y, z) {
        this.a.add(x, y, z);
        this.b.add(x, y, z);
        return this;
    }

    difference(x, y, z) {
        return new Line3(this.a.x - x, this.a.y - y, this.a.z - z, this.b.x - x, this.b.y - y, this.b.z - z);
    }

    setDifference(x, y, z) {
        this.a.subtract(x, y, z);
        this.b.subtract(x, y, z);
        return this;
    }

    dilate(x, y, z) {
        return new Line3(this.a.x * x, this.a.y * y, this.a.z * z, this.b.x * x, this.b.y * y, this.b.z * z);
    }

    setDilation(x, y, z) {
        this.a.multiply(x, y, z);
        this.b.multiply(x, y, z);
        return this;
    }

    compress(x, y, z) {
        return new Line3(this.a.x / x, this.a.y / y, this.a.z / z, this.b.x / x, this.b.y / y, this.b.z / z);
    }

    setCompression(x, y, z) {
        this.a.divide(x, y, z);
        this.b.divide(x, y, z);
        return this;
    }

    // acts as a circular normal, changing point B by a specified angle and rotating on point A.
    rotate(rotations, order) {
        let axis = order.match(validaxis);

        assert.ok(axis, `Invalid order specified. Must be a string containing at least one concatenated xyz value.`);
        assert.ok(Array.isArray(rotations), `Invalid rotations specified. Must be an array of zero or more Eucledian angle(s).`);
        assert.ok(rotations.length === axis[0].length, `Rotations length must match the order length.`);

        let { x, y, z } = this.b.minus(this.a); // rotate on point a
        let matrix = new vec3().update(this._matrix);

        for (let i = 0, il = axis[0].length; i < il; i++) {
            let xo = x, yo = y, zo = z;
            if (axis[0][i] === 'x') {
                z = zo * Math.cos(rotations[i]) - yo * Math.sin(rotations[i]);
                y = zo * Math.sin(rotations[i]) + yo * Math.cos(rotations[i]);
                matrix.x += rotations[i];
            }

            else if (axis[0][i] === 'y') {
                x = xo * Math.cos(rotations[i]) - zo * Math.sin(rotations[i]);
                z = xo * Math.sin(rotations[i]) + zo * Math.cos(rotations[i]);
                matrix.y += rotations[i];
            }

            else if (axis[0][i] === 'z') {
                y = yo * Math.cos(rotations[i]) - xo * Math.sin(rotations[i]);
                x = yo * Math.sin(rotations[i]) + xo * Math.cos(rotations[i]);
                matrix.z += rotations[i];
            }
        }

        return new Line3(this.a.x, this.a.y, this.a.z, this.a.x + x, this.a.y + y, this.a.z + z, matrix);
    }

    setRotation(rotations, order) {
        let line = this.rotate(rotations, order);
        this.a = line.a;
        this.b = line.b;
        this._matrix = line.matrix;
        return this;
    }

    align(rotations, order, original) {
        let axisNew = order.match(validaxis);
        let axisOld = original.match(validoriginal);

        assert.ok(axisNew, `Invalid rotation order specified. Must be a string containing at least one concatenated xyz value.`);
        assert.ok(axisOld, `Invalid original rotation order specified. Must be a string containing 0-3 concatenated xyz value(s).`);
        assert.ok(Array.isArray(rotations), `Invalid rotations specified. Must be an array of zero or more Eucledian angle(s).`);
        assert.ok(rotations.length === axisNew[0].length, `Rotations length must match the order length.`);

        let { x, y, z } = this.b.minus(this.a); // rotate on point a
        let matrix = new vec3().update(this._matrix);

        // revert to original line prior to rotations
        for (let i = axisOld[0].length - 1, il = 0; il <= i; i--) {
            let x1 = x, y1 = y, z1 = z;

            if (axisOld[0][i] === 'x') {
                y = y1 * Math.cos(matrix.x) - z1 * Math.sin(matrix.x);
                z = z1 * Math.cos(matrix.x) + y1 * Math.sin(matrix.x);
                matrix.x = 0;
            }

            else if (axisOld[0][i] === 'y') {
                x = x1 * Math.cos(matrix.y) + z1 * Math.sin(matrix.y);
                z = z1 * Math.cos(matrix.y) - x1 * Math.sin(matrix.y); 
                matrix.y = 0;
            }

            else if (axisOld[0][i] === 'z') {
                x = x1 * Math.cos(matrix.z) - y1 * Math.sin(matrix.z);
                y = y1 * Math.cos(matrix.z) + x1 * Math.sin(matrix.z);
                matrix.z = 0;
            }
        }

        // apply new rotations
        for (let i = 0, il = axisNew[0].length; i < il; i++) {
            let xo = x, yo = y, zo = z;
            if (axisNew[0][i] === 'x') {
                z = zo * Math.cos(rotations[i]) - yo * Math.sin(rotations[i]);
                y = zo * Math.sin(rotations[i]) + yo * Math.cos(rotations[i]);
                matrix.x += rotations[i];
            }

            else if (axisNew[0][i] === 'y') {
                x = xo * Math.cos(rotations[i]) - zo * Math.sin(rotations[i]);
                z = xo * Math.sin(rotations[i]) + zo * Math.cos(rotations[i]);
                matrix.y += rotations[i];
            }

            else if (axisNew[0][i] === 'z') {
                y = yo * Math.cos(rotations[i]) - xo * Math.sin(rotations[i]);
                x = yo * Math.sin(rotations[i]) + xo * Math.cos(rotations[i]);
                matrix.z += rotations[i];
            }
        }

        // current = original * originalmatrix. new = original * newmatrix. Therefore new is defined by a ratio of new/old matrix. 
        return new Line3(this.a.x, this.a.y, this.a.z, this.a.x + x, this.a.y + y, this.a.z + z, matrix);
    }

    setAlignment(rotations, order, original) {
        let line = this.align(rotations, order, original);
        this.a = line.a;
        this.b = line.b;
        this._matrix = line.matrix;
        return this;
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

    xyOffset(gradient) {
        return this.a.y - (gradient || this.xyGradient()) * this.a.x;
    }

    zyOffset(gradient) {
        return this.a.y - (gradient || this.zyGradient()) * this.a.z;
    }

    xzOffset(gradient) {
        return this.a.z - (gradient || this.xzGradient()) * this.a.x;
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

            // determine line restrictions in each dimension
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

    polyIntercept(segments) {
        let intercepts = {};

        for (let polygon of segments) {
            // face1 face2
            let d1 = new vec3(polygon[0], polygon[1], polygon[2]);
            let d2 = new vec3(polygon[3], polygon[4], polygon[5]);

            let t1 = this.convertList(polygon, 'xyzxyz', 'yzxyzx'); // first set of transformations
            let t2 = this.convertList(polygon, 'xyzxyz', 'zxyzxy'); // second set of transformations

            for (let i = 0; i < 6; i++) {
                // determine the order in which converted values match their domain restriction axis
                let axisA = 'xyzxyz'[i]; // current axis
                let axisB = 'yzxyzx'[i];
                let axisC = 'zxyzxy'[i];
                // retrieve values from the already-converted lists t1 and t2.
                let a = polygon[i];
                let b = t1[i];
                let c = t2[i];
                // check if the constant fits inside the polygon. (null means that the axis doesn't change, and therefore doesn't need to be checked)
                let aCheck = a === null || (this.a[axisA] <= a && a <= this.b[axisA]) || (this.b[axisA] <= a && a <= this.a[axisA]); // only need to check if it fits inside the line
                let bCheck = b === null || (d1[axisB] <= b && b <= d2[axisB]) || (d2[axisB] <= b && b <= d1[axisB]); // transformation B can fit inside of the polygon
                let cCheck = c === null || (d1[axisC] <= c && c <= d2[axisC]) || (d2[axisC] <= c && c <= d1[axisC]); // transformation C can fit inside of the polygon
                // all checks have passed, and a valid intercept has been found
                if (aCheck && bCheck && cCheck) {
                    let intercept = new vec3(a ?? this.a[axisA], b ?? this.a[axisB], c ?? this.a[axisC]);
                    intercepts[intercept.toString()] = intercept;
                }
            }
        }
        return Object.values(intercepts);
    }

    /*
    **  Miscellaneous
    */

   iterate(length) {
       let intercepts = [];
       let distance = this.a.distanceTo(this.b);
       let difference = this.b.minus(this.a);
       let ratio = length/distance;

       for (let c = ratio; c < 1; c += ratio) {
           intercepts.push(this.a.plus(difference.scaled(c)));
       }
       return intercepts;
   }

    convert(c, prior, post) {
        // check if constant is between two values
        let domainCheck = (this.a[prior] <= c && c <= this.b[prior]) || (this.b[prior] <= c && c <= this.a[prior]);
        let d1 = this.b[prior] - this.a[prior];
        let d2 = this.b[post] - this.a[post];
        // cannot determine a ratio if there's no change in the axis
        if (domainCheck && d1 > 0 && d2 > 0) {
            let ratio = c/d1;
            let convert = ratio * d2;
            return convert;
        }
        return null;
    }

    convertList(constants, prior, post) {
        let conversions = [];
        for (let i = 0, il = constants.length; i < il; i++) {
            let convert = this.convert(constants[i], prior[i], post[i]);
            conversions.push(convert);
        }
        return conversions;
    }
}
    
const validaxis = /^[xyz]*$/gi;
const validoriginal = /^((x?yz|zy)|(y?xz|zx)|(z?xy|yx)|[xyz])?$/gi;

module.exports = Line3;
