const line3 = require(`./line3`);
const plot = require(`nodeplotlib`);
let lines = [];
let lineA = new line3(-10, -10, -10, 10, 10, 10).offset(2,0,3);
console.log(lineA)
let polygon = [[0, 0, 0, 5, 5, 5]];

let intercepts = lineA.polyIntercept(polygon);

for (let shape of polygon) {
    let x0 = shape[0], y0 = shape[1], z0 = shape[2];
    let x1 = shape[3], y1 = shape[4], z1 = shape[5];

    let horizontal = [
        [x0, z0],
        [x1, z0],
        [x1, z1],
        [x0, z1],
    ];

    // get the horizontal lines for y0
    for (let i = 0, il = horizontal.length; i < il; i++) {
        let vec2a = horizontal[i];
        let vec2b = horizontal[i+1] || horizontal[0];
        let line = new line3(vec2a[0], y0, vec2a[1], vec2b[0], y0, vec2b[1]);
        lines.push(line);
    }

    // get the horizontal lines for y1
    for (let i = 0, il = horizontal.length; i < il; i++) {
        let vec2a = horizontal[i];
        let vec2b = horizontal[i+1] || horizontal[0];
        let line = new line3(vec2a[0], y1, vec2a[1], vec2b[0], y1, vec2b[1]);
        lines.push(line);
    }

    // get the vertical lines
    for (let vec2 of horizontal) {
        let line = new line3(vec2[0], y0, vec2[1], vec2[0], y1, vec2[1]);
        lines.push(line);
    }
}

// add original line to lines
lines.push(lineA);

let objects = [];
for (let line of lines) {
    objects.push({
        x: [line.a.x, line.b.x], 
        y: [line.a.z, line.b.z], 
        z: [line.a.y, line.b.y], 
        type: 'scatter3d'
    });
}

for (let intercept of intercepts) {
    objects.push({
        x: [intercept.x],
        y: [intercept.z],
        z: [intercept.y],
        type: 'scatter3d'
    });
}

plot.plot(objects);