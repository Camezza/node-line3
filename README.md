<div align="center">
<h2>Node-line3</h2>
  <img src="https://img.shields.io/github/issues/Camezza/node-line3?style=for-the-badge">
  <img src="https://img.shields.io/github/license/Camezza/node-line3?style=for-the-badge">
  <p><i>Mathematical applications of 3D lines in a cartesian medium</i></p>
</div>

## Features
- Methods of line transformation including compression and dilation
- Determination of line intercepts with 3 dimensional shapes
- Dynamic Eular rotation defined by specified matrix patterns

## Installation
- This package can be installed with [npm](https://www.npmjs.com/):
```bash
npm i line3
```

## API
```javascript
/*
**  Transformations
*/

// Instantiation
offset(x, y, z) // Retrieves the translation of a line's supplement. "x", "y" and "z" are numbers.
difference(x, y, z) // Retrieves the translation of a line's difference. "x", "y" and "z" are numbers.
dilate(x, y, z) // Retrieves the dilation of a line. "x", "y" and "z" are numbers.
compress(x, y, z) // Retrieves the compression of a line. "x", "y" and "z" are numbers.
rotate(matrix, order) // Retrieves a rotated line. "matrix". is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings (see notes).

// Mutation
setOffset(x, y, z) // Translates the line by the specified sum. "x", "y" and "z" are numbers.
setDifference(x, y, z) // Translates the line by the specified difference. "x", "y" and "z" are numbers.
setDilation(x, y, z) // Dilatse the line by the specified values. "x", "y" and "z" are numbers.
setCompression(x, y, z) // Compresses the line by the specified values. "x", "y" and "z" are numbers.
setRotation(matrix, order) // Performs rotations on the line. "matrix" is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings (see notes).

/*
**  Functions
*/

// 2D line applications (y = mx+b = nz+c)
xyGradient() // Retrieves the gradient of y/x in a 2D plane
zyGradient() // Retrieves the gradient of y/z in a 2D plane
xyOffset(gradient) // Retrieves the offset of y to x in a 2D plane. "gradient" is an optional number defining the line's slope.
zyOffset(gradient) // Retrieves the offset of y to z in a 2D plane. "gradient" is an optional number defining the line's slope.

// 3D line applications
intercept(line) // Determines where a line will intercept another line. "line" is an instance of a line3 value. Returns null if there's no intercept.
polyIntercept(segments) // Determines where a line will intercept with a cuboid-composed polygon. "segments" is an array of shapes in the form of [x1, y1, z1, x2, y2, z2].

/*
**  Miscellaneous
*/

iterate(length) // Returns a sequence of linear intercepts seperated by a length. "length" is a number specifying the distance between intercepts.
```

## Notes
- Rotation matrix order combinations are [Euler](https://en.wikipedia.org/wiki/Euler_angles) based, and should be aligned in such a way to avoid [gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock) (The parent should be the axis that the line is least likely to face). For more information, please [watch this video](https://www.youtube.com/watch?v=zc8b2Jo7mno).