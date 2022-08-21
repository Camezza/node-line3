<div align="center">
<h2>Line3 (NodeJS)</h2>
  <img src="https://img.shields.io/npm/v/line3?style=flat-square">
  <img src="https://img.shields.io/github/license/firejoust/node-line3?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/node-line3?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/node-line3?style=flat-square">
  <p><i>Mathematical application for 3D lines in a cartesian medium</i></p>
</div>

## Features
- Methods of line transformation (add, sub, mult, div)
- Determine line intersection coordinates with 3D shapes
- Standard form linear gradient equations

## Installation
- This package can be installed with [npm](https://www.npmjs.com/):
```bash
npm install line3
```

## API
#### Object Definition
```javascript
const Line3 = require("line3") // https://www.npmjs.com/package/line3
const Vec3 = require("vec3") // https://www.npmjs.com/package/vec3
const Rect = [[x1, y1, z1], [x2, y2, z2]] // values are a number
const Face = [x, y, z] // values are 0 or 1
```
#### Methods
```javascript
// creating a new line
let line = new Line3(x1, y1, z1, x2, y2, z2)
let line =  Line3.fromVec(a, b) // parameters are Vec3

// reference an existing line (clone or modify)
line.get()
line.set(x1, y1, z1, x2, y2, z2)

// line transformation (clone)
line.getPlus(x, y, z)
line.getDiff(x, y, z)
line.getMult(x, y, z)
line.getDiv (x, y, z)

// line transformation (modify)
line.setPlus(x, y, z)
line.setDiff(x, y, z)
line.setMult(x, y, z)
line.setDiv (x, y, z)

//  f(x) = g(y) = h(z) standard form methods, returns a number or null
line.xyGradient()
line.zyGradient()
line.xzGradient()
line.xyOffset(gradient)
line.zyOffset(gradient)
line.xzOffset(gradient)

// line intersection, returns Vec3 or null
line.lineIntercept(line) // "line" is a Line3
line.rectIntercept(rect) // "rect" is a Rect

// miscellaneous functions
line.rectFace() // returns a Face (the index for a Rect's visible faces)
line.scale(axis, constant) // returns a Vec3 (the position relative to a constant on the line)
line.iterate(length) // returns a Vec3[] array (positional increments on the line)
```
