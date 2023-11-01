let canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.screen.width;
canvas.height = window.screen.height;

//Drawing stuff

let camera = {x:0, y:0};

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function strokeRect(x, y, width, height, color, camera={x:0, y:0}) {
    ctx.fillStyle = color;
    ctx.strokeRect(Math.round(x - camera.x), Math.round(y - camera.y), width, height);
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
let entities = [];

let player = new Player(2500, 2500);
entities.push(player);

window.addEventListener("click", ()=>{
    entities.push(new Bullet(player.handX, player.handY));
});

for(let i = 0; i < 25; ++i){
    let x = Math.floor(Math.random()*500 + 250);
    let y = Math.floor(Math.random()*500 + 250);
    let enemy = new Enemy(x, y, 25, 25, "green", "zombie");
    let count = 0;
    for(let j = 0; j < entities.length; ++j) {
        if(!isColliding(enemy, entities[j])) {++count;}
    }
    if(count == entities.length) {entities.push(enemy);}
    else {--i;}
}

//==========================================

function updateCamera() {
    camera.x = player.x - canvas.width/2;
    camera.y = player.y - canvas.height/2.5;
}

const UPS = 120;

function gameLoop() {
    updateCamera();
    player.update();
    for(let i = 1; i < entities.length; ++i) {
        entities[i].update(entities);
        if(entities[i].canBeDeleted) { entities.splice(i, 1); }
    }
}

function renderLoop() {
    clearCanvas();
    for(let i = 0; i < entities.length; ++i) {
        entities[i].draw(camera);
    }
    console.log(player);

    //Draw Map
    drawMap();
    drawMiniMap();

    //Draw random block
    fillRect(0, 0, UNIT_SIZE, UNIT_SIZE, "gray", camera);

    //Draw health bar
    fillRect(5, 5, player.health * 2, 25, "red");
    strokeRect(5, 5, 200, 25, "black");

    //Draw events
    drawEventsBox();

    window.requestAnimationFrame(renderLoop);
}

renderLoop();
setInterval(gameLoop, 1000/UPS);