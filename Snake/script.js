let canvas = document.getElementById("canvas");

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let ctx = canvas.getContext('2d');

let rows = 20;
let unitSize = CANVAS_SIZE/rows;
let updatesPerSecond = 10;
let gameRunning = false;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function fillCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.fill();
}

function drawSnakeBody(snakePart) {
    // ctx.fillStyle = "rgb(255, 255, 255)";
    // ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeStyle = "rgb(0, 196, 9)";
    let x1 = snakePart.x + unitSize/2;
    let y1 = snakePart.y + unitSize/2;
    let x2;
    let y2;
    ctx.lineWidth = 1;
    switch(snakePart.direction) {
        case 'U':
            y2 = y1 - unitSize; x2 = x1;
            break;
        case 'D':
            y2 = y1 + unitSize; x2 = x1;
            break;
        case 'L':
            x2 = x1 + unitSize; y2 = y1;
            break;
        case 'R':
            x2 = x1 - unitSize; y2 = y1;
            break;
    }
    drawLine(x1, y1, x2, y2);
}

function drawGridLines() {
    for(let i = 0; i < rows; ++i) {
        ctx.strokeStyle = "white";
        drawLine(0, i*unitSize, CANVAS_SIZE, i*unitSize);
        drawLine(i*unitSize, 0, i*unitSize, CANVAS_SIZE);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function SnakePart(x, y) {
    this.x = x;
    this.y = y;
    this.direction = null;
}

let startingSnakeLength = 6;
let snakeLength = startingSnakeLength;
let points = 0;
let direction = 'R';

let snake = [];

function initializeSnake() {
    for(let i = 0; i < snakeLength; ++i) {
        snake[i] = new SnakePart((snakeLength - i - 1)*unitSize, 0);
    }
}

initializeSnake();

function drawSnake() {
    for(let i = 0; i < snake.length; ++i) {
        drawSnakeBody(snake[i]);
    }
}

ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
drawSnake();
drawBoard();

let keys = [];
let isDirectionQueued = false;
let nextDirection = null;

document.addEventListener("keydown", (event)=>{
    if(event.key == 'ArrowUp' && direction != 'D') {
        keys[event.key] = true;
        if(!isDirectionQueued) {
            direction = 'U';
            isDirectionQueued = true;
        }
        else if(nextDirection == null) {
            nextDirection = 'U';
        }
    }
    if(event.key == 'ArrowDown' && direction != 'U') {
        keys[event.key] = true;
        if(!isDirectionQueued) {
            direction = 'D';
            isDirectionQueued = true;
        }
        else if(nextDirection == null) {
            nextDirection = 'D';
        }
    }
    if(event.key == 'ArrowLeft' && direction != 'R') {
        keys[event.key] = true;
        if(!isDirectionQueued) {
            direction = 'L';
            isDirectionQueued = true;
        }
        else if(nextDirection == null) {
            nextDirection = 'L';
        }
    }
    if(event.key == 'ArrowRight' && direction != 'L') {
        keys[event.key] = true;
        if(!isDirectionQueued) {
            direction = 'R';
            isDirectionQueued = true;
        }
        else if(nextDirection == null) {
            nextDirection = 'R';
        }
    }
    if(event.key == 'R' || event.key == 'r') { restart(); document.getElementById("start-button").innerHTML = "Restart"; }
})

document.addEventListener("keyup", (event)=>{
    if(event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        keys[event.key] = false;
    }
})

//Prevents screen from scrolling when using up and down arrow keys
document.onkeydown = function(evt) {
    evt = evt || window.event;
    let keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};

function moveSnake() {
    snake[0].direction = direction;
    for(let i = snake.length - 1; i > 0; --i) {
        snake[i].x = snake[i-1].x;
        snake[i].y = snake[i-1].y;
        snake[i].direction = snake[i-1].direction;
    }
    switch(direction) {
        case 'U':
            snake[0].y -= unitSize;
            break;
        case 'D':
            snake[0].y += unitSize;
            break;
        case 'L':
            snake[0].x -= unitSize;
            break;
        case 'R':
            snake[0].x += unitSize;
            break;
    }
}

let apple = {
    x: 0,
    y: 0,
};

function spawnApple() {
    let collided = false;
    do {
        apple.x = Math.floor(Math.random() * rows) * unitSize;
        apple.y = Math.floor(Math.random() * rows) * unitSize;
        for(let i = 0; i < snake.length; ++i) {
            if(snake[i].x == apple.x && snake[i].y == apple.y) {
                collided = true;
                break;
            }
            else {
                collided = false;
            }
        }
    } while(collided);
}

function drawApple() {
    ctx.fillStyle = "red";
    fillCircle(apple.x + unitSize/2, apple.y + unitSize/2, unitSize/2);
}

function isAppleEaten() {
    if(apple.x == snake[0].x && apple.y == snake[0].y) { return true; }
    else { return false; }
}

spawnApple();

let pointsLabel = document.getElementById("points");

function updatePointsLabel() {
    pointsLabel.innerHTML = `Points: ${points}`;
}

function checkForCollisions() {
    if(snake[0].x < 0 || snake[0].x >= rows*unitSize) { return true; }
    else if(snake[0].y < 0 || snake[0].y >= rows*unitSize) { return true; }
    else {
        for(let i = 1; i < snake.length; ++i) {
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) { return true; }
        }
    }
    return false;
}

function gameOver() {
    pointsLabel.innerHTML = `Game Over! (Points: ${points})`;
    gameRunning = false;
}

function restart() {
    while(snake.length != 0) { snake.pop(); }
    snakeLength = startingSnakeLength;
    initializeSnake();
    direction = 'R';
    nextDirection = null;
    isDirectionQueued = false;
    points = 0;
    updatePointsLabel();
    spawnApple();
    gameRunning = true;
}

document.getElementById("start-button").onclick = ()=>{
    document.getElementById("start-button").innerHTML = "Restart";
    restart();
};

drawGridLines();

window.setInterval(()=>{
    if(gameRunning) {
        moveSnake();
        if(checkForCollisions()) {
            gameOver();
        }
        if(nextDirection != null) {
            direction = nextDirection;
            nextDirection = null;
        }
        else { isDirectionQueued = false; }
        if(isAppleEaten()) {
            ++points;
            updatePointsLabel();
            spawnApple();
            ++snakeLength;
            snake.push(new SnakePart());
        }
        clearCanvas();
        drawBoard();
        drawApple();
        drawSnake();
        drawGridLines();
    }
}, 1000/updatesPerSecond)