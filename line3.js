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

        // y=mx+b
        let m = this.xyGradient();
        let b = this.xyOffset(m);

        // y=nz+c
        let n = this.zyGradient();
        let c = this.zyOffset(n);

        for (let rectangle of segments) {
            if (!Array.isArray(rectangle) && !rectangle.length === 6) throw new TypeError(`Invalid polygon segment specified. Must include two groups of consecutive x, y, z values.`);
        
            // these values have to be inside their polygon domains to be an intercept.
            let xa = (rectangle[1]-b)/m;
            let xb = (rectangle[4]-b)/m;

            let za = (rectangle[1]-c)/n;
            let zb = (rectangle[4]-c)/n;

            let yxa = (m*rectangle[0])+b;
            let yxb = (m*rectangle[3])+b;

            let yza = (n*rectangle[0])+c;
            let yzb = (n*rectangle[3])+c;

            console.log(`
            xa: ${xa} (Inside domain: ${(rectangle[0] <= xa && xa <= rectangle[3]) || (rectangle[3] <= xa && xa <= rectangle[0])}) (Inside line: ${(this.a.x <= xa && xa <= this.b.x) || (this.b.x <= xa && xa <= this.a.x)})
            xb: ${xb} (Inside domain: ${(rectangle[0] <= xb && xb <= rectangle[3]) || (rectangle[3] <= xb && xb <= rectangle[0])}) (Inside line: ${(this.a.x <= xb && xb <= this.b.x) || (this.b.x <= xb && xb <= this.a.x)})
            
            yxa: ${yxa} (Inside domain: ${(rectangle[1] <= yxa && yxa <= rectangle[4]) || (rectangle[4] <= yxa && yxa <= rectangle[1])}) (Inside line: ${(this.a.y <= yxa && yxa <= this.b.y) || (this.b.y <= yxa && yxa <= this.a.y)})
            yxb: ${yxb} (Inside domain: ${(rectangle[1] <= yxb && yxb <= rectangle[4]) || (rectangle[4] <= yxb && yxb <= rectangle[1])}) (Inside line: ${(this.a.y <= yxb && yxb <= this.b.y) || (this.b.y <= yxb && yxb <= this.a.y)})
            
            yza: ${yza} (Inside domain: ${(rectangle[1] <= yza && yza <= rectangle[4]) || (rectangle[4] <= yza && yza <= rectangle[1])}) (Inside line: ${(this.a.y <= yza && yza <= this.b.y) || (this.b.y <= yza && yza <= this.a.y)})
            yzb: ${yzb} (Inside domain: ${(rectangle[1] <= yzb && yzb <= rectangle[4]) || (rectangle[4] <= yzb && yzb <= rectangle[1])}) (Inside line: ${(this.a.y <= yzb && yzb <= this.b.y) || (this.b.y <= yzb && yzb <= this.a.y)})
            
            za: ${za} (Inside domain: ${(rectangle[2] <= za && za <= rectangle[5]) || (rectangle[5] <= za && za <= rectangle[2])}) (Inside line: ${(this.a.z <= za && za <= this.b.z) || (this.b.z <= za && za <= this.a.z)})
            zb: ${zb} (Inside domain: ${(rectangle[2] <= zb && zb <= rectangle[5]) || (rectangle[5] <= zb && zb <= rectangle[2])}) (Inside line: ${(this.a.z <= zb && zb <= this.b.z) || (this.b.z <= zb && zb <= this.a.z)})
            `);

            // [x yx yz z] values for restricted plane intercepts
            let ra = [(rectangle[1]-b)/m, (m*rectangle[0])+b, (n*rectangle[0])+c, (rectangle[1]-c)/n];
            let rb = [(rectangle[4]-b)/m, (m*rectangle[3])+b, (n*rectangle[3])+c, (rectangle[4]-c)/n];
            let query = [];

            // perhaps it's screwing up because y has two values? (from x and z)
            // so far only observed logical error within the z axis when ya, yb, za, zb are valid

            for (let restriction of [ra,rb]) {
                for (let i = 0, r = 0, il = 3; i < il; i++, r++) {
                    let constant = restriction[r];
                    let polydomain = (rectangle[i] <= constant && constant <= rectangle[i+3]) || (rectangle[i+3] <= constant && constant <= rectangle[i]);
                    let linedomain = (line[i] <= constant && constant <= line[i+3]) || (line[i+3] <= constant && constant <= line[i]);
                    if (r === 1) i--; // i still needs to reference another y value for yz

                    // xyz constant is within polygon and line radius (valid intercept)
                    if (polydomain && linedomain) {
                        if (r === 0) query.push(new vec3(constant, m*constant+b, (m*constant+b-c)/n)); // x
                        else if (r === 1) query.push(new vec3((constant-b)/m, constant, (constant-c)/n)); // y (x)
                        else if (r === 2) query.push(new vec3((constant-b)/m, constant, (constant-c)/n)); // y (z)
                        else if (r === 3) query.push(new vec3((n*constant+c-b)/m, n*constant+c, constant)); // z
                    }
                }
            }

            let intercepts = [];
            for (let i of query) {
                if (
                    ((rectangle[0] <= i.x && i.x <= rectangle[3]) || (rectangle[3] <= i.x && i.x <= rectangle[0])) &&
                    ((rectangle[1] <= i.y && i.y <= rectangle[4]) || (rectangle[4] <= i.y && i.y <= rectangle[1])) && 
                    ((rectangle[2] <= i.z && i.z <= rectangle[5]) || (rectangle[5] <= i.z && i.z <= rectangle[2]))
                ) intercepts.push(i);
            }

            console.log(intercepts);
            return intercepts;
        }
    }
























}

module.exports = Line3;