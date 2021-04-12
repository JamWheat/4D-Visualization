const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineCap = "round";
console.log(ctx)

const xReadout = document.getElementById("X");
const yReadout = document.getElementById("Y");
const zReadout = document.getElementById("Z");
const manualAngle = document.getElementById("manual-angle");

const xSlider = document.getElementById("xRot");
const ySlider = document.getElementById("yRot");
const zSlider = document.getElementById("zRot");

const xySlider = document.getElementById("xyRot");
const yzSlider = document.getElementById("yzRot");
const xzSlider = document.getElementById("xzRot");
const xwSlider = document.getElementById("xwRot");
const ywSlider = document.getElementById("ywRot");
const zwSlider = document.getElementById("zwRot");

const rotationThrottle = .002;
const edgeLangth = 175;

const projSlider = document.getElementById("proj");
const projOut = document.getElementById("projOut");

const camSlider = document.getElementById("cam");
const camOut = document.getElementById("camOut");

manualAngle.addEventListener("click", clicked);

function clicked(){
    console.log("clicked");
}

const projectionVect = [0, 0, 0];
const surfce4d = [0, 0, 0, 0];

const cameraVect = [0, 0, 0];
const camera4d = [0, 0, 0, 0];

const makeVecArray = (edge, depth) => {
    const output = new Array(Math.pow(2, depth));

    let x = edge, y = edge, z = edge, w = edge;
    
    for(let i = 1; i < output.length+1; i++){
        output[i-1] = [x, y, z, w];
        if (i%8 == 0) w *= -1;
        if (i%4 == 0) z *= -1;
        if (i%2 == 0) y *= -1;
        x *= -1;
    }
    
    return output;
}

const vectors = makeVecArray(edgeLangth, 4);

// vectors = [
//     [-edgeLangth, -edgeLangth, -edgeLangth, -edgeLangth],
//     [-edgeLangth, +edgeLangth, -edgeLangth, -edgeLangth],
//     [+edgeLangth, +edgeLangth, -edgeLangth, -edgeLangth],
//     [+edgeLangth, -edgeLangth, -edgeLangth, -edgeLangth],
//     [-edgeLangth, -edgeLangth, +edgeLangth, -edgeLangth],
//     [-edgeLangth, +edgeLangth, +edgeLangth, -edgeLangth],
//     [+edgeLangth, +edgeLangth, +edgeLangth, -edgeLangth],
//     [+edgeLangth, -edgeLangth, +edgeLangth, -edgeLangth],
//     [-edgeLangth, -edgeLangth, -edgeLangth, +edgeLangth],
//     [-edgeLangth, +edgeLangth, -edgeLangth, +edgeLangth],
//     [+edgeLangth, +edgeLangth, -edgeLangth, +edgeLangth],
//     [+edgeLangth, -edgeLangth, -edgeLangth, +edgeLangth],
//     [-edgeLangth, -edgeLangth, +edgeLangth, +edgeLangth],
//     [-edgeLangth, +edgeLangth, +edgeLangth, +edgeLangth],
//     [+edgeLangth, +edgeLangth, +edgeLangth, +edgeLangth],
//     [+edgeLangth, -edgeLangth, +edgeLangth, +edgeLangth]
// ]

const drawLoop = () => {
    setInterval(draw, 16)
}



const matrixMult = (matrix, vector, mag) => {
    const newCoords = [];

    for(let i = 0; i < mag; i++){
        let sum = 0;
        for(let j = 0; j < mag; j++){
            sum += matrix[i][j] * vector[j]
        }
        newCoords.push(sum);
    }
    
    for(let i = 0; i < mag; i++){
        vector[i] = newCoords[i]
    };
}

const wAdjust = (vector) => {
    deltaW = vector[3] - camera4d[3];
    newX = (projectionVect[2] / deltaW) * vector[0];
    newY = (projectionVect[2] / deltaW) * vector[1];
    newZ = (projectionVect[2] / deltaW) * vector[2];
    return [newX, newY, newZ];
}

const zAdjust = (vector) => {
    deltaZ = vector[2] - cameraVect[2];
    newX = (projectionVect[2] / deltaZ) * vector[0];
    newY = (projectionVect[2] / deltaZ) * vector[1];
    return [newX, newY, vector[2]];
}

const centerImage = (vecArr) => {
    for(let i = 0; i < vecArr.length; i++){
        vecArr[i][0] += canvas.width / 2;
        vecArr[i][1] += canvas.height / 2;
    }
}

const drawLine = (startVect, endVect) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(startVect[0], startVect[1]);
    ctx.lineTo(endVect[0], endVect[1]);
    ctx.stroke();
}

const drawFace = (vectArr, startVect) => {
    drawLine(vectArr[startVect], vectArr[startVect+1]);
    drawLine(vectArr[startVect+1], vectArr[startVect+3]);
    drawLine(vectArr[startVect+3], vectArr[startVect+2]);
    drawLine(vectArr[startVect+2], vectArr[startVect]);
}

const drawShape = (vectArr) => {
    // "inner" cube
    drawFace(vectArr, 0);
    drawFace(vectArr, 4);
    for(let i = 0; i < vectArr.length-12; i++){
        drawLine(vectArr[i], vectArr[i+4]);
    }

    // "outer cube"
    drawFace(vectArr, 8);
    drawFace(vectArr, 12);
    for(let i = 8; i < vectArr.length-4; i++){
        drawLine(vectArr[i], vectArr[i+4]);
    }

    // cube connections
    for(let i = 0; i < vectArr.length-8; i++){
        drawLine(vectArr[i], vectArr[i+8]);
    }
}

const draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    projectionVect[2] = -275;
    cameraVect[2] = -450;
    surfce4d[3] = -150;
    camera4d[3] = -550;
    // projOut.innerHTML = projSlider.value;
    // camOut.innerHTML = camSlider.value;

    const xyzVects = [];
    const xyVecs = [];

    for(let i = 0; i < vectors.length; i++){
        xyzVects.push(wAdjust(vectors[i]))

        xyVecs.push(zAdjust(xyzVects[i]))
    }

    centerImage(xyVecs);

    drawShape(xyVecs);

    

    for(let i = 0; i < vectors.length; i++){
        matrixMult(xRotationMatrix(xSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(yRotationMatrix(ySlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(zRotationMatrix(zSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(xyRotationMatrix(xySlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(yzRotationMatrix(yzSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(xzRotationMatrix(xzSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(xwRotationMatrix(xwSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(ywRotationMatrix(ywSlider.value*rotationThrottle), vectors[i], 4);
        matrixMult(zwRotationMatrix(zwSlider.value*rotationThrottle), vectors[i], 4);
        
    }

    // console.log(xyVecs);

}

// draw();

drawLoop();