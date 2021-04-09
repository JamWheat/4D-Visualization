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

const eyeDist = 200;

const objectOrigin = new Vector3(canvas.width/2, canvas.height/2, 450);
const camaraVect = new Vector3(150, 150, 0);

vectors2d = [
    vectA = new Vector2(originX-100, originY),
    vectB = new Vector2(originX, originY+100),
    vectC = new Vector2(originX+100, originY+0),
    vectD = new Vector2(originX, originY-100)
]

vectors3d = [
    new Vector3(objectOrigin.x-100, objectOrigin.y-100, objectOrigin.z-100),
    new Vector3(objectOrigin.x-100, objectOrigin.y+100, objectOrigin.z-100),
    new Vector3(objectOrigin.x+100, objectOrigin.y+100, objectOrigin.z-100),
    new Vector3(objectOrigin.x+100, objectOrigin.y-100, objectOrigin.z-100),
    new Vector3(objectOrigin.x-100, objectOrigin.y-100, objectOrigin.z+100),
    new Vector3(objectOrigin.x-100, objectOrigin.y+100, objectOrigin.z+100),
    new Vector3(objectOrigin.x+100, objectOrigin.y+100, objectOrigin.z+100),
    new Vector3(objectOrigin.x+100, objectOrigin.y-100, objectOrigin.z+100),
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

const rotation2d = (vector, angle) => {
    oldX = vector.x - originX;
    oldY = vector.y - originY;
    newX = oldX * Math.cos(angle) - oldY * Math.sin(angle);
    newY = oldX * Math.sin(angle) + oldY * Math.cos(angle);
    vector.x = newX + originX;
    vector.y = newY + originY;
}

const badZRotations = (vector, angle) => {
    oldZ = vector.z - 450;
    oldY = vector.y - originY;
    newZ = oldZ * Math.cos(angle) - oldY * Math.sin(angle);
    newY = oldZ * Math.sin(angle) + oldY * Math.cos(angle);
    vector.z = newZ + 450;
    vector.y = newY + originY;
}

const zAdjust = (vector) => {
    // deltaZ = (vector.z + (vector.y + vector.x)) + (vector.y - vector.x);
    // deltaY = (vector.z + (vector.y + vector.x)) - (vector.y - vector.x);
    // deltaX = (vector.y + vector.x) - vector.z;
    deltaX = vector.x - camaraVect.x;
    deltaY = vector.y - camaraVect.y;
    newX = (eyeDist / vector.z) * deltaX;
    newY = (eyeDist / vector.z) * deltaY;
    // newX = (eyeDist / vector.z) * vector.x;
    // newY = (eyeDist / vector.z) * vector.y;
    return new Vector2(newX, newY);
}

const draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const adjVecs = [];

    for(let i = 0; i < vectors3d.length; i++){
        adjVecs.push(zAdjust(vectors3d[i]))
    }

    for(let i = 0; i < adjVecs.length; i++){
        adjVecs[i].x += 150;
        adjVecs[i].y += 150;
    }

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
        // rotation2d(vectors3d[i], .01);
        // badZRotations(vectors3d[i], .01);
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