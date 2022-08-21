const Vec3 = require("vec3")
const Vec3Map = ["x", "y", "z"]

class Line3 {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.a = new Vec3(x1, y1, z1)
        this.b = new Vec3(x2, y2, z2)
    }

    static fromVec3(a, b) {
        return new Line3(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    /*
    **  Translations
    */

    get() {
        return this.fromVec(this.a, this.b)
    }

    set(x1, y1, z1, x2, y2, z2) {
        this.a.x = x1
        this.a.y = y1
        this.a.z = z1

        this.b.x = x2
        this.b.y = y2
        this.b.z = z2
    }

    getPlus(x, y, z) {
        return new Line3(this.a.x + x, this.a.y + y, this.a.z + z, this.b.x + x, this.b.y + y, this.b.z + z)
    }

    setPlus(x, y, z) {
        this.a.add(x, y, z)
        this.b.add(x, y, z)
        return this
    }

    getDiff(x, y, z) {
        return new Line3(this.a.x - x, this.a.y - y, this.a.z - z, this.b.x - x, this.b.y - y, this.b.z - z)
    }

    setDiff(x, y, z) {
        this.a.subtract(x, y, z)
        this.b.subtract(x, y, z)
        return this
    }

    getMult(x, y, z) {
        return new Line3(this.a.x * x, this.a.y * y, this.a.z * z, this.b.x * x, this.b.y * y, this.b.z * z)
    }

    setMult(x, y, z) {
        this.a.multiply(x, y, z)
        this.b.multiply(x, y, z)
        return this
    }

    getDiv(x, y, z) {
        return new Line3(this.a.x / x, this.a.y / y, this.a.z / z, this.b.x / x, this.b.y / y, this.b.z / z)
    }

    setDiv(x, y, z) {
        this.a.divide(x, y, z)
        this.b.divide(x, y, z)
        return this
    }

    /*
    **  Maths Functions
    */

    getFloor() {
        return new Line3 (
            Math.floor(this.a.x),
            Math.floor(this.a.y),
            Math.floor(this.a.z),
            Math.floor(this.b.x),
            Math.floor(this.b.y),
            Math.floor(this.b.z)
        )
    }

    setFloor() {
        this.a.x = Math.floor(this.a.x)
        this.a.y = Math.floor(this.a.y)
        this.a.z = Math.floor(this.a.z)

        this.b.x = Math.floor(this.b.x)
        this.b.y = Math.floor(this.b.y)
        this.b.z = Math.floor(this.b.z)
    }

    getCeil() {
        return new Line3 (
            Math.ceil(this.a.x),
            Math.ceil(this.a.y),
            Math.ceil(this.a.z),
            Math.ceil(this.b.x),
            Math.ceil(this.b.y),
            Math.ceil(this.b.z)
        )
    }

    setCeil() {
        this.a.x = Math.ceil(this.a.x)
        this.a.y = Math.ceil(this.a.y)
        this.a.z = Math.ceil(this.a.z)

        this.b.x = Math.ceil(this.b.x)
        this.b.y = Math.ceil(this.b.y)
        this.b.z = Math.ceil(this.b.z)
    }

    /*
    **  Standard Form
    */

    xyGradient() {
        return (this.b.y-this.a.y)/(this.b.x-this.a.x)
    }

    zyGradient() {
        return (this.b.y-this.a.y)/(this.b.z-this.a.z)
    }

    xzGradient() {
        return (this.b.z-this.a.z)/(this.b.x-this.a.x)
    }

    xyOffset(gradient) {
        return this.a.y - (gradient || this.xyGradient()) * this.a.x
    }

    zyOffset(gradient) {
        return this.a.y - (gradient || this.zyGradient()) * this.a.z
    }

    xzOffset(gradient) {
        return this.a.z - (gradient || this.xzGradient()) * this.a.x
    }

    lineIntercept(line) {
        // y=mx+b
        let m1 = this.xyGradient(), m2 = line.xyGradient()
        let b1 = this.xyOffset(m1), b2 = line.xyOffset(m2)
        let x = (b2-b1)/(m1-m2)

        // y=nz+c
        let n1 = this.zyGradient(), n2 = line.zyGradient()
        let c1 = this.zyOffset(n1), c2 = line.zyOffset(n2)
        let z = (c2-c1)/(n1-n2)

        // determine both values sit on the same line
        let yx = m1*x + b1
        let yz = n1*z + c1

        if (yx === yz) {
            let y = yx

            // determine line restrictions in each dimension
            let x1Check = (this.a.x <= x && x <= this.b.x) || (this.b.x <= x && x <= this.a.x)
            let y1Check = (this.a.y <= y && y <= this.b.y) || (this.b.y <= y && y <= this.a.y)
            let z1Check = (this.a.z <= z && z <= this.b.z) || (this.b.z <= z && z <= this.a.z)

            let x2Check = (line.a.x <= x && x <= line.b.x) || (line.b.x <= x && x <= line.a.x)
            let y2Check = (line.a.y <= y && y <= line.b.y) || (line.b.y <= y && y <= line.a.y)
            let z2Check = (line.a.z <= z && z <= line.b.z) || (line.b.z <= z && z <= line.a.z)

            if (x1Check && x2Check && y1Check && y2Check && z1Check && z2Check) {
                return new Vec3(x, y, z)
            }
        }
        return null
    }

    rectIntercept(rectangle) {
        // only use visible faces
        for (let i of this.rectFace()) {
            for (let j = 0; j < 3; j++) {
                
                let jAxis = Vec3Map[j]
                let sequence = this.scale(jAxis, rectangle[i][j])
                let valid = true

                // we have an intercept
                if (
                    sequence.x != null
                &&  sequence.y != null
                &&  sequence.z != null
                )

                // verify constants within rectangle
                for (let k = 0; valid && k < 3; k++) {
                    let kAxis = Vec3Map[k]
                    let constant = sequence[kAxis]

                    valid &&= (
                        rectangle[0][k] <= constant && constant <= rectangle[1][k]
                    ||  rectangle[1][k] <= constant && constant <= rectangle[0][k]
                    )
                }

                if (valid) return sequence
            }
        }

        return null
    }

    /*
    **  Miscellaneous
    */

    rectFace() {
        return [
            Number(this.b.x - this.a.x < 0),
            Number(this.b.y - this.a.y < 0),
            Number(this.b.z - this.a.z < 0)
        ]
    }

    scale(axis, constant) {
        let vec = new Vec3(
            null,
            null,
            null
        )
        let offset

        // find which sign/orientation to use for the constant
        if (this.a[axis] <= constant && constant <= this.b[axis]) {
            offset = this.a
        } else if (this.b[axis] <= constant && constant <= this.a[axis]) {
            offset = this.b
        } else {
            return vec // outside line bounds
        }
        
        // get the scale of the constant
        vec[axis] = constant
        let diff = this.b.minus(this.a)
        let ratio = (constant - offset[axis]) / diff[axis]

        // verify scaled constants are within line bounds
        for (let i = 0; i < 3; i++) {
            let ref = Vec3Map[i]
            if (i === ref) continue

            let value = (ratio * diff[ref]) + offset[ref]

            if (
                this.a[ref] <= value && value <= this.b[ref]
             || this.b[ref] <= value && value <= this.a[ref]
            )
            vec[ref] = value
        }

        return vec
    }

    iterate(length) {
        let intercepts = []
        let distance = this.a.distanceTo(this.b)
        let difference = this.b.minus(this.a)
        let ratio = length/distance

        for (let c = ratio; c < 1; c += ratio) {
            intercepts.push(this.a.plus(difference.scaled(c)))
        }
        return intercepts
    }
}

module.exports = Line3
