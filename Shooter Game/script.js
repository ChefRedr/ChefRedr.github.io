let canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = window.screen.width;
const CANVAS_HEIGHT = window.screen.height;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const UNIT_SIZE = CANVAS_WIDTH/16;

let camera = {x:0, y:0};

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function fillRect(x, y, width, height, color, camera={x:0, y:0}) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x - camera.x), Math.round(y - camera.y), width, height);
}

function fillCircle(x, y, radius, color, camera={x:0, y:0}) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(Math.round(x - camera.x), Math.round(y - camera.y), radius, 0, Math.PI*2, false);
    ctx.fill();
}

let mouse = {x:0, y:0};

function getMosuePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y,
    };
}
document.addEventListener("mousemove", (event)=>{
    mouse = getMosuePosition(canvas, event);
});

let keys = [];
document.addEventListener("keydown", (event)=>{
    keys[event.key] = true;
});
document.addEventListener("keyup", (event)=>{
    keys[event.key] = false;
});

let player = new Player(0, 0, 25, "black");

//==========================================
let entities = [];

entities.push(player);

window.addEventListener("click", ()=>{
    entities.push(new Bullet(player.handX, player.handY));
});

entities.push(new Enemy(-100, -100, 50, "green", "zombie"));
//==========================================

function updateCamera() {
    camera.x = player.x - CANVAS_WIDTH/2;
    camera.y = player.y - CANVAS_HEIGHT/2.5;
}

const UPS = 250;

function gameLoop() {
    updateCamera();
    player.update();
}

function renderLoop() {
    clearCanvas();
    for(let i = 0; i < entities.length; ++i) {
        entities[i].update(entities);
        entities[i].draw(camera);
    }
    window.requestAnimationFrame(renderLoop);
}

renderLoop();
setInterval(gameLoop, 1000/UPS);