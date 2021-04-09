// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

class Vertex2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let pos = 0;

const drawLoop = () => {
    setInterval(draw, 33)
}

const draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillRect(150, pos, 20, 20);
    pos++;
    console.log("frame");
}