const line3 = require(`./line3`);
const plot = require(`nodeplotlib`);
const { Vec3 } = require("vec3");
let lineA = new line3(4, -10, 6, 10, 10, 10); 
let lineB = new line3(-10, -10, -10, 10, 9, 99);

console.log(`1A:\n(${lineA.a.x}, ${lineA.a.z}, ${lineA.a.y})\n1B:\n(${lineA.b.x}, ${lineA.b.z}, ${lineA.b.y})`);
console.log(`2A:\n(${lineB.a.x}, ${lineB.a.z}, ${lineB.a.y})\n2B:\n(${lineB.b.x}, ${lineB.b.z}, ${lineB.b.y})`);
let intercept = lineA.intercept(lineB);
if (intercept) console.log(`Intercept:\n(${intercept.x}, ${intercept.z}, ${intercept.y})`);
else console.log(`NO intercept!`);

/*
for (let i = 0, il = 360; i < il; i += 360/36) {
    let owo = line.rotateMatrix([i], 'x');
    console.log(owo.b);
}
*/
intercept = intercept || new Vec3(0, 0, 0);

for (let i = 0; i < 360; i += 45) {
    let line1 = lineA.rotateMatrix([Math.PI * i/180, Math.PI * i/180], `xz`);
    let line2 = lineB.rotateMatrix([-Math.PI * i/180, -Math.PI * i/180], `xz`);
plot.plot([
    {
        x: [line1.a.x, line1.b.x], 
        y: [line1.a.z, line1.b.z], 
        z: [line1.a.y, line1.b.y], 
        type: 'scatter3d'
    },
    {
        x: [line2.a.x, line2.b.x], 
        y: [line2.a.z, line2.b.z], 
        z: [line2.a.y, line2.b.y], 
        type: 'scatter3d'
    },
    {
        x: [intercept.x], 
        y: [intercept.y], 
        z: [intercept.z],   
        type: 'scatter3d'
    }
])
}