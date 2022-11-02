const FPS = 60;

let canvas = document.getElementById("canvas");
canvas.width = window.screen.width;
canvas.height = window.screen.height;
const UNIT_SIZE = Math.round(canvas.width/16);

let ctx = canvas.getContext('2d');
ctx.strokeRect(0, 0, canvas.width, canvas.height);

let keys = [];

document.addEventListener("keydown", (event)=>{
    keys[event.key] = true;
});
document.addEventListener("keyup", (event)=>{
    keys[event.key] = false;
});

//prevents scrolling
document.onkeydown = function(event) {
    event = event || window.event;
    let key = event.key;
    if (key == "ArrowUp" || key == "ArrowDown") {
        return false;
    }
};

let cameraView = {
    x: 0,
    y: 0,
};

function fill(r, g, b, a=1) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

function strokeRect(x, y, width, height, cameraView={x:0, y:0}) {
    ctx.strokeRect(Math.round(x - cameraView.x), Math.round(y - cameraView.y), width, height);
}

function fillRect(x, y, width, height, cameraView={x:0, y:0}) {
    ctx.fillRect(Math.round(x - cameraView.x), Math.round(y - cameraView.y), width, height);
}

function drawImage(imgURL, x, y, width, height) {
    let image = new Image();
    image.onload = ()=>{
        ctx.drawImage(image, x, y, width, height);
    }
    image.src = imgURL;
}

function drawMap() {
    fill(0, 0, 0);
    fillRect(0, 0, canvas.width, canvas.height);
    for(let r = 0; r < currentMap.length; ++r) {
        for(let c = 0; c < currentMap[r].length; ++c) {
            switch(currentMap[r][c]) {
                case mapKey.LEVEL_1_TELEPORTER:
                    fill(255, 0, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    fill(196, 0, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    fillRect(c*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    break;
                case mapKey.LEVEL_2_TELEPORTER:
                    fill(0, 0, 255);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    fill(0, 0, 196);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    fillRect(c*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    break;
                case mapKey.LEVEL_3_TELEPORTER:
                    fill(255, 255, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    fill(196, 196, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    fillRect(c*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    break;
                case mapKey.LEVEL_4_TELEPORTER:
                    fill(0, 255, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    fill(0, 196, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, UNIT_SIZE, UNIT_SIZE/8, cameraView);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    fillRect(c*UNIT_SIZE + UNIT_SIZE - UNIT_SIZE/8, r*UNIT_SIZE, UNIT_SIZE/8, UNIT_SIZE, cameraView);
                    break;
                case mapKey.EMPTY_BLOCK:
                    fill(0, 0, 0);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    break;
                case mapKey.SOLID_BLOCK:
                    fill(96, 96, 96);
                    fillRect(c*UNIT_SIZE, r*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, cameraView);
                    break;
            }
        }
        fill(96, 96, 96);
    }
}

class Player {
    constructor() {
        this.spawnX = UNIT_SIZE*1.5;
        this.spawnY = UNIT_SIZE*3.5;
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.size = UNIT_SIZE/4;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 0.3;
        this.friction = 0.9;
    }
    update() {
        if(keys["ArrowRight"]) {
            this.xVelocity += this.speed;
        }
        if(keys["ArrowLeft"]) {
            this.xVelocity -= this.speed;
        }
        if(keys["ArrowUp"]) {
            this.yVelocity -= this.speed;
        }
        if(keys["ArrowDown"]) {
            this.yVelocity += this.speed;
        }
        this.xVelocity *= this.friction;
        this.yVelocity *= this.friction;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        for(let r = 0; r < currentMap.length; ++r) {
            for(let c = 0; c < currentMap[r].length; ++c) {
                let xPosition = c*UNIT_SIZE;
                let yPosition = r*UNIT_SIZE;
                if(checkCollision(xPosition, yPosition)) {
                    if(currentMap[r][c] == mapKey.SOLID_BLOCK) { this.die(); }
                    if(currentMap[r][c] == mapKey.LEVEL_1_TELEPORTER) {
                        this.spawnX = UNIT_SIZE/2;
                        this.spawnX = UNIT_SIZE/2;
                        currentMap = level1Map;
                        this.die();
                    }
                }
            }
        }
    }
    die() {
        this.x = this.spawnX;
        this.y = this.spawnY;
    }
    draw() {
        fill(96, 96, 96);
        fillRect(this.x, this.y, this.size, this.size, cameraView);
    }
}

let player = new Player();

function updateCameraView() {
    cameraView.x = player.x - canvas.width/2;
    cameraView.y = player.y - canvas.height/2;
}

function checkCollision(rectX, rectY) {
    if((player.x + player.size) > rectX && player.x < (rectX + UNIT_SIZE) && (player.y + player.size) > rectY && player.y < (rectY + UNIT_SIZE)) {
        return true;
    }
}

window.setInterval(()=>{
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    updateCameraView();
    drawMap();
    player.update();
    player.draw();
}, 1000/FPS);