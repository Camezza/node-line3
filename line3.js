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
    rotate(matrix, order) {
        let axis = order.match(valid);
        let x = this.b.x, y = this.b.y, z = this.b.z;

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

    setRotation(matrix, order) {
        let line = this.rotate(matrix, order);
        this.a = line.a;
        this.b = line.b;
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

    xyOffset(gradient) {
        return this.a.y - (gradient || this.xyGradient()) * this.a.x;
    }

    zyOffset(gradient) {
        return this.a.y - (gradient || this.zyGradient()) * this.a.z;
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
        if (!Array.isArray(segments) && segments.length === 0) throw new TypeError(`Invalid polygon specified. Must be a two-dimensional array of rectangular segments.`);

        let line = [this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z];
        let d, e;

        // y=m(x-d)+b
        let m = this.xyGradient();
        let b = this.xyOffset(m);
        if (Math.abs(m) === Infinity) d = this.a.x; // infinite gradient, allow x constant to prevent runtime issues (NaN)

        // y=n(z-e)+c
        let n = this.zyGradient();
        let c = this.zyOffset(n);
        if (Math.abs(n) === Infinity) e = this.a.z;

        for (let rectangle of segments) {
            if (!Array.isArray(rectangle) && rectangle.length !== 6) throw new TypeError(`Invalid polygon segment specified. Must include two groups of consecutive x, y, z values.`);
        
            // [x yx yz z] values for restricted plane intercepts
            let ra = [d || (rectangle[1]-b)/m, (m*rectangle[0])+b || Infinity, (n*rectangle[0])+c || Infinity, e || (rectangle[1]-c)/n];
            let rb = [d || (rectangle[4]-b)/m, (m*rectangle[3])+b || Infinity, (n*rectangle[3])+c || Infinity, e || (rectangle[4]-c)/n];
            let intercepts = {};

            for (let restriction of [ra,rb]) {
                for (let i = 0, r = 0, il = 3; i < il; i++, r++) { // i is a reference for polygon domain
                    let constant = restriction[r];
                    let polydomain = (rectangle[i] <= constant && constant <= rectangle[i+3]) || (rectangle[i+3] <= constant && constant <= rectangle[i]);
                    let linedomain = (line[i] <= constant && constant <= line[i+3]) || (line[i+3] <= constant && constant <= line[i]);
                    if (r === 1) i--; // i still needs to reference another y value for yz

                    // xyz constant is within polygon and line radius (valid intercept)
                    if (polydomain && linedomain) {
                        if (r === 0) appendIntercept(new vec3(constant, m*constant+b, e || (m*constant+b-c)/n), rectangle, intercepts); // x
                        else if (r === 1) appendIntercept(new vec3(d || (constant-b)/m, constant, e || (constant-c)/n), rectangle, intercepts); // y (x)
                        else if (r === 2) appendIntercept(new vec3(d || (constant-b)/m, constant, e || (constant-c)/n), rectangle, intercepts); // y (z)
                        else if (r === 3) appendIntercept(new vec3(d || (n*constant+c-b)/m, n*constant+c, constant, rectangle), intercepts); // z
                    }
                }
            }
            return Object.values(intercepts);
        }
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
}
    
// prevents duplicate intercept values
function appendIntercept(vec, polygon, obj) {
    let referee = vec.toString();
    if (!obj[referee]) {
        if (
            ((polygon[0] <= vec.x && vec.x <= polygon[3]) || (polygon[3] <= vec.x && vec.x <= polygon[0])) &&
            ((polygon[1] <= vec.y && vec.y <= polygon[4]) || (polygon[4] <= vec.y && vec.y <= polygon[1])) && 
            ((polygon[2] <= vec.z && vec.z <= polygon[5]) || (polygon[5] <= vec.z && vec.z <= polygon[2]))
        ) obj[referee] = vec;
    }
}

module.exports = Line3;
