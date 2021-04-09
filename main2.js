const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
console.log(ctx);

class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Vector3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const originX = canvas.width / 2;
const originY = canvas.height / 2;

const eyeDist = -250;

const objectOrigin = new Vector3(canvas.width/2, canvas.height/2, 450);
const camaraVect = new Vector3(0, 0, -450);

vectors3d = [
    new Vector3(-100, -100, -100),
    new Vector3(-100, +100, -100),
    new Vector3(+100, +100, -100),
    new Vector3(+100, -100, -100),
    new Vector3(-100, -100, +100),
    new Vector3(-100, +100, +100),
    new Vector3(+100, +100, +100),
    new Vector3(+100, -100, +100),
]

vectors = [
    [-100, -100, -100],
    [-100, +100, -100],
    [+100, +100, -100],
    [+100, -100, -100],
    [-100, -100, +100],
    [-100, +100, +100],
    [+100, +100, +100],
    [+100, -100, +100],
]

const drawLoop = () => {
    setInterval(draw, 16)
}

const drawLine = (lineStartX, lineStartY, lineEndX, lineEndY) => {
    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.stroke();
}

// const matrixMult = (matrix, vector) => {
//     const vectArr = [];
//     for(const coord in vector)
//         vectArr.push(vector[coord])

//     const newCoords = []

//     for(let i = 0; i < vectArr.length; i++){
//         let sum = 0;
//         for(let j = 0; j < vectArr.length; j++){
//             sum += matrix[i][j] * vectArr[j]
//         }
//         newCoords.push(sum);
//     }

//     for(const coord in vector)
//         vector[coord] = newCoords
    
    
//     return vectArr;
// }

const matrixMult = (matrix, vector) => {
    const newCoords = [];

    for(let i = 0; i < vector.length; i++){
        let sum = 0;
        for(let j = 0; j < vector.length; j++){
            sum += matrix[i][j] * vector[j]
        }
        newCoords.push(sum);
    }
    
    for(let i = 0; i < vector.length; i++){
        vector[i] = newCoords[i]
    };
}

const xRotationMatrix = (angle) => {
    return [[1, 0, 0],
    [0, Math.cos(angle), -Math.sin(angle)],
    [0, Math.sin(angle), Math.cos(angle)]]
}

const testVect = [1, 2, 3];
const testMatrix = [[1, 2, 3], [2, 3, 4], [3, 4, 5]];
console.log(testVect);
console.log(matrixMult(testMatrix, testVect));
console.log(testVect);
// console.log(matrixMult(xRotation(4), testVect));

const rotation2d = (vector, angle) => {
    newX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
    newY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
    vector.x = newX;
    vector.y = newY;
}

const badZRotations = (vector, angle) => {
    oldZ = vector.z;
    oldY = vector.y;
    newZ = oldZ * Math.cos(angle) - oldY * Math.sin(angle);
    newY = oldZ * Math.sin(angle) + oldY * Math.cos(angle);
    vector.z = newZ;
    vector.y = newY;
}

const zAdjust = (vector) => {
    deltaZ = vector.z - camaraVect.z;
    newX = (eyeDist / deltaZ) * vector.x;
    newY = (eyeDist / deltaZ) * vector.y;
    return new Vector2(newX, newY);
}

const centerImage = (vecArr) => {
    for(let i = 0; i < vecArr.length; i++){
        vecArr[i].x += canvas.width / 2;
        vecArr[i].y += canvas.height / 2;
    }
}

const draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const adjVecs = [];

    for(let i = 0; i < vectors3d.length; i++){
        adjVecs.push(zAdjust(vectors3d[i]))
    }

    centerImage(adjVecs);

    

    for(let i = 0; i < adjVecs.length-4; i++){
        if (i != adjVecs.length-5) drawLine(adjVecs[i].x, adjVecs[i].y, adjVecs[i+1].x, adjVecs[i+1].y);
        else drawLine(adjVecs[i].x, adjVecs[i].y, adjVecs[0].x, adjVecs[0].y);
    }
    for(let i = 4; i < adjVecs.length; i++){
        if (i != adjVecs.length-1) drawLine(adjVecs[i].x, adjVecs[i].y, adjVecs[i+1].x, adjVecs[i+1].y);
        else drawLine(adjVecs[i].x, adjVecs[i].y, adjVecs[4].x, adjVecs[4].y);
    }
    for(let i = 0; i < adjVecs.length-4; i++){
        drawLine(adjVecs[i].x, adjVecs[i].y, adjVecs[i+4].x, adjVecs[i+4].y);
    }

    for(let i = 0; i < vectors3d.length; i++){
        rotation2d(vectors3d[i], .01);
        badZRotations(vectors3d[i], .01);
    }

    // for(let i = 0; i < vectors3d.length; i++){
    //     vectors3d[i].x++;
    // }

    // for(let i = 0; i < vectors2d.length; i ++){
    //     if (i != vectors2d.length-1) drawLine(vectors2d[i].x, vectors2d[i].y, vectors2d[i+1].x, vectors2d[i+1].y);
    //     else drawLine(vectors2d[i].x, vectors2d[i].y, vectors2d[0].x, vectors2d[0].y);
    // }

    // for(let i = 0; i < vectors2d.length; i++){
    //     rotation2d(vectors2d[i], .03)
    // }

}

drawLoop();