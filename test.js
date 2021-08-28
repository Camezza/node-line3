const line3 = require(`./line3`);
let line = new line3(0, 0, 0, 5, 5, 5);
for (let i = 0, il = 360; i < il; i += 360/36) {
    let owo = line.rotate(i * Math.PI/180, 0, i * Math.PI/180);
    let matrix = owo.getMatrix();
    //console.log(`(${owo.b.x}, ${owo.b.y}, ${owo.b.z})`);
    console.log(`(X=${matrix.x * 180/Math.PI}, Y=${matrix.y * 180/Math.PI}, Z=${matrix.z * 180/Math.PI})`);
}