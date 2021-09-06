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
offset(x, y, z) // Return an instance of the sum
difference(x, y, z) // Return the difference 
dilate(x, y, z) // Return the line's product 
compress(x, y, z) // Return the line's division
rotate(matrix, order) // Return Eular rotations of the line. Matrix is an array of angles, order is any concatenation of 'x', 'y' or 'z'.

// Mutation
setOffset(x, y, z) // Update the line by the specified sum
setDifference(x, y, z) // Update the line by the specified difference
setDilation(x, y, z) // Update the line by the specified product
setCompression(x, y, z) // Update the line by the specified division
setRotation(matrix, order) // Perform Eular rotations on the line. Matrix is an array of angles, order is any concatenation of 'x', 'y' or 'z'.

/*
**  Functions
*/

// 2D line applications (y = mx+b = nz+c)
xyGradient() // Retrieve the gradient of y/x in a 2D plane
zyGradient() // Retrieve the gradient of y/z in a 2D plane
xyOffset(gradient) // Retrieve the offset of y to x in a 2D plane. gradient is optional.
zyOffset(gradient) // Retrieve the offset of y to z in a 2D plane. gradient is optional.

// 3D line applications
intercept(line) // Determines where a line will intercept another line. Returns null if there's no intercept.
polyIntercept(segments) // Determine where a line will intercept with a polygon comprised of 3D rectangular prisms. segments is an array of shapes in the form of [x1, y1, z1, x2, y2, z2].

/*
**  Miscellaneous
*/

iterate(length) // Returns a sequence of linear intercepts seperated by a distance of length.
```

