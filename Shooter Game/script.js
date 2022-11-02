let canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;

//Drawing stuff

let camera = {x:0, y:0};

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

//Mouse stuff

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

//Keyboard input

let keys = [];
document.addEventListener("keydown", (event)=>{
    keys[event.key] = true;
});
document.addEventListener("keyup", (event)=>{
    keys[event.key] = false;
});

//==========================================
let player = new Player(0, 0, 25, "black");

let entities = [];

entities.push(player);

window.addEventListener("click", ()=>{
    entities.push(new Bullet(player.handX, player.handY));
});

entities.push(new Enemy(-100, -100, 50, "green", "zombie"));
//==========================================

function updateCamera() {
    camera.x = player.x - canvas.width/2;
    camera.y = player.y - canvas.height/2.5;
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