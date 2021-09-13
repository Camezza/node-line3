<div align="center">
<h2>Node-line3</h2>
  <img src="https://img.shields.io/github/issues/Camezza/node-line3?style=for-the-badge">
  <img src="https://img.shields.io/github/license/Camezza/node-line3?style=for-the-badge">
  <p><i>Mathematical applications for 3D lines in a cartesian medium</i></p>
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
// See "Notes" for more details.

/*
**  Initialisation
*/

new line3(x1, y1, z1, x2, y2, z2, matrix) // Creates a new line3 object. "x1", "y1", "z1" are numbers defining the starting point of the line, and "x2", "y2", "z2" define the end. "matrix" is a vec3 object describing the existing rotation of the line between 1 and -1.
line3.fromVec3(a, b, matrix) // Creates a new line3 object from vec3 values. "a" defines the starting point of the line. "b" defines the ending point of the line. "matrix" is a vec3 object describing the existing rotation of the line between 1 and -1.

/*
**  Transformations
*/

// Instantiation methods
instance() // Retrieves a new instance of the current line.
offset(x, y, z) // Retrieves the translation of a line's supplement. "x", "y" and "z" are numbers.
difference(x, y, z) // Retrieves the translation of a line's difference. "x", "y" and "z" are numbers.
dilate(x, y, z) // Retrieves the dilation of a line. "x", "y" and "z" are numbers.
compress(x, y, z) // Retrieves the compression of a line. "x", "y" and "z" are numbers.
rotate(rotations, order) // Retrieves a rotated line. "rotations". is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings.
align(rotations, order, original) // Retrieves a line oriented to the specified matrix. "rotations". is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings. "original" is the initial rotation order before the line was transformed, containing a combination of up to three differing 'x', 'y' or 'z' strings.

// Modification methods
setOffset(x, y, z) // Translates the line by the specified sum. "x", "y" and "z" are numbers.
setDifference(x, y, z) // Translates the line by the specified difference. "x", "y" and "z" are numbers.
setDilation(x, y, z) // Dilatse the line by the specified values. "x", "y" and "z" are numbers.
setCompression(x, y, z) // Compresses the line by the specified values. "x", "y" and "z" are numbers.
setRotation(rotations, order) // Performs rotations on the line. "rotations" is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings.
setAlignment(rotations, order, original) // Orientates a line by the specified matrix. "rotations". is an array of angles. "order" is any combination of concatenated 'x', 'y' or 'z' strings. "original" is the initial rotation order before the line was transformed, containing a combination of up to three differing 'x', 'y' or 'z' strings.

/*
**  Functions
*/

// 2D line applications (y = mx+b = nz+c)
xyGradient() // Retrieves the gradient of y/x in a 2D plane
zyGradient() // Retrieves the gradient of y/z in a 2D plane
xzGradient() // Retrieves the gradient of z/x in a 2D plane
xyOffset(gradient) // Retrieves the offset of y to x in a 2D plane. "gradient" is an optional number defining the line's slope.
zyOffset(gradient) // Retrieves the offset of y to z in a 2D plane. "gradient" is an optional number defining the line's slope.
xzOffset(gradient) // Retrieves the offset of z to x in a 2D plane. "gradient" is an optional number defining the line's slope.

// 3D line applications
intercept(line) // Determines where a line will intercept another line. "line" is an instance of a line3 value. Returns null if there's no intercept.
polyIntercept(segments) // Determines where a line will intercept with a cuboid-composed polygon. "segments" is an array of shapes in the form of [x1, y1, z1, x2, y2, z2].

/*
**  Miscellaneous
*/

iterate(length) // Returns a sequence of linear intercepts seperated by a length. "length" is a number specifying the distance between intercepts.
convert(constants, currentIndex, newIndex) // Determines value conversions for constants sitting on a line. "constants" is an array of numbers. "currentIndex" and "newIndex" specify the axis to convert from/to, being any combination of concatenated 'x', 'y' or 'z' strings. Returns an array of numbers or null values if a constant cannot be determined (no change in axis, etc)
```

## Notes
- Rotation matrix order combinations are [Euler](https://en.wikipedia.org/wiki/Euler_angles) based, and should be aligned in such a way to avoid [gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock) (The parent should be the axis that the line is least likely to face). For more information, please [watch this video](https://www.youtube.com/watch?v=zc8b2Jo7mno).
