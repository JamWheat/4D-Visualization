const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineCap = "round";
console.log(ctx)

const xReadout = document.getElementById("X");
const yReadout = document.getElementById("Y");
const zReadout = document.getElementById("Z");
const manualAngle = document.getElementById("manual-angle");



let paused = false;

const pausePlay = () => {
    if(paused){
        xReadout.disabled = true;
        yReadout.disabled = true;
        zReadout.disabled = true;
        // angles[0] = xReadout.value;
        // angles[1] = yReadout.value;
        // angles[2] = zReadout.value;
        pausePlayBtn.value = "Pause";
        paused = false;
    } else {
        xReadout.disabled = false;
        yReadout.disabled = false;
        zReadout.disabled = false;
        pausePlayBtn.value = "Play";
        paused = true;
    }
}

const pausePlayBtn = document.getElementById("pause-play");
pausePlayBtn.addEventListener("click", pausePlay);



const xSlider = document.getElementById("xRot");
const ySlider = document.getElementById("yRot");
const zSlider = document.getElementById("zRot");
// const wSlider = document.getElementById("wRot");

// const xySlider = document.getElementById("xyRot");
// const yzSlider = document.getElementById("yzRot");
// const xzSlider = document.getElementById("xzRot");
const xwSlider = document.getElementById("xwRot");
const ywSlider = document.getElementById("ywRot");
const zwSlider = document.getElementById("zwRot");

const rotationThrottle = .1;
const edgeLangth = 175;

const projSlider = document.getElementById("proj");
const projOut = document.getElementById("projOut");

const camSlider = document.getElementById("cam");
const camOut = document.getElementById("camOut");

manualAngle.addEventListener("click", clicked);

function clicked(){
    console.log("clicked");
}

const surface3d = [0, 0, -275];
const surface4d = [0, 0, 0, -250];

const camera3d = [0, 0, -450];
const camera4d = [0, 0, 0, -550];

const toRadians = (degrees) => {
	return degrees * Math.PI / 180;
}

const angles = [0, 30, 0, 0, 0, 0]

// const updateAngleReadouts = () => {
//     xReadout.value = Math.floor(angles[0]);
//     yReadout.value = Math.floor(angles[1]);
//     zReadout.value = Math.floor(angles[2]);
// }

// let xAngle = 0;
// let yAngle = 30;
// let zAngle = 0;
// let xwAngle = 0;
// let ywAngle = 0;
// let zwAngle = 0;

const angleClamp = (angle) => {
    if (angle > 360) return angle -= 360;
    if (angle < 0) return angle += 360;
    return angle;
}

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
    setInterval(() => {
        if (!paused){
            draw();
        }
    }, 16)
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

    // return newCoords;
}

const wAdjust = (vector) => {
    deltaW = vector[3] - camera4d[3];
    newX = (surface4d[3] / deltaW) * vector[0];
    newY = (surface4d[3] / deltaW) * vector[1];
    newZ = (surface4d[3] / deltaW) * vector[2];
    return [newX, newY, newZ];
}

const zAdjust = (vector) => {
    deltaZ = vector[2] - camera3d[2];
    newX = (surface3d[2] / deltaZ) * vector[0];
    newY = (surface3d[2] / deltaZ) * vector[1];
    return [newX, newY, vector[2]];
}

const centerImage = (vecArr) => {
    for(let i = 0; i < vecArr.length; i++){
        vecArr[i][0] += canvas.width / 2;
        vecArr[i][1] += canvas.height / 2;
    }
}

const drawDot = (vector) => {
    ctx.beginPath();
    ctx.arc(vector[0], vector[1], (-vector[2]+500)/100, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
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
    // projOut.innerHTML = projSlider.value;
    // camOut.innerHTML = camSlider.value;

    const angleAdjusts = [xSlider.value, ySlider.value, zSlider.value, xwSlider.value, ywSlider.value, zwSlider.value];

    for(let i = 0; i < angles.length; i++){
        // angle = angles[i];
        // angle += angleAdjusts[i]*rotationThrottle;
        // angle = angleClamp(angle);
        // angles[i] = angle;
        throttledAdjustment = angleAdjusts[i]*rotationThrottle;
        angles[i] = (angles[i] + throttledAdjustment + 360) % 360;
    }

    // xAngle += xSlider.value*rotationThrottle;
    // yAngle += ySlider.value*rotationThrottle;
    // zAngle += zSlider.value*rotationThrottle;
    // xwAngle += xwSlider.value*rotationThrottle;
    // ywAngle += ywSlider.value*rotationThrottle;
    // zwAngle += zwSlider.value*rotationThrottle;

    const vectors = makeVecArray(edgeLangth, 4);

    for(let i = 0; i < vectors.length; i++){
        matrixMult(xwRotationMatrix(toRadians(angles[3])), vectors[i], 4);
        matrixMult(ywRotationMatrix(toRadians(angles[4])), vectors[i], 4);
        matrixMult(zwRotationMatrix(toRadians(angles[5])), vectors[i], 4);
        matrixMult(xRotationMatrix(toRadians(angles[0])), vectors[i], 4);
        matrixMult(yRotationMatrix(toRadians(angles[1])), vectors[i], 4);
        matrixMult(zRotationMatrix(toRadians(angles[2])), vectors[i], 4);
    }

    const xyzVects = [];
    const xyVecs = [];

    for(let i = 0; i < vectors.length; i++){
        xyzVects.push(wAdjust(vectors[i]))

        xyVecs.push(zAdjust(xyzVects[i]))
    }

    centerImage(xyVecs);

    drawShape(xyVecs);

    for(let i = 0; i < xyVecs.length; i++){
        drawDot(xyVecs[i]);
    }

    // updateAngleReadouts();

    xReadout.value = Math.floor(angles[0]);
    yReadout.value = Math.floor(angles[1]);
    zReadout.value = Math.floor(angles[2]);


    // for(let i = 0; i < vectors.length; i++){
    //     matrixMult(xRotationMatrix(xSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(yRotationMatrix(ySlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(zRotationMatrix(zSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(xyRotationMatrix(xySlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(yzRotationMatrix(yzSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(xzRotationMatrix(xzSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(xwRotationMatrix(xwSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(ywRotationMatrix(ywSlider.value*rotationThrottle), vectors[i], 4);
    //     matrixMult(zwRotationMatrix(zwSlider.value*rotationThrottle), vectors[i], 4);
    // }

    // console.log(xyVecs);

}

// draw();

drawLoop();