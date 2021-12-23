let canvas = document.getElementById("canvas");

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let c = canvas.getContext('2d');

let rows = 20;
let unitSize = CANVAS_SIZE/rows;
let updatesPerSecond = 10;
let gameRunning = true;

function drawLine(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
}

function clearCanvas() { c.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); }

function drawBoard() {
    c.fillStyle = "black";
    c.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function SnakePart(x, y) {
    this.x = x;
    this.y = y;
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
        if(i == 0) { c.fillStyle = "rgb(0, 196, 0)"; }
        else { c.fillStyle = "rgb(0, 255, 0)"; }
        c.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
    }
}

c.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
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
    if(event.key == 'R' || event.key == 'r') { restart(); }
})

document.addEventListener("keyup", (event)=>{
    if(event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        keys[event.key] = false;
    }
})

function moveSnake() {
    for(let i = snake.length - 1; i > 0; --i) {
        snake[i].x = snake[i-1].x;
        snake[i].y = snake[i-1].y;
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
    c.fillStyle = "red";
    c.fillRect(apple.x, apple.y, unitSize, unitSize);
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
        clearCanvas()
        drawBoard();
        drawApple();
        drawSnake();
    }
}, 1000/updatesPerSecond)