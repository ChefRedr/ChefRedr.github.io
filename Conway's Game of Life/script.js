"use strict";

let canvas = document.getElementById("canvas");

canvas.width = window.screen.width;
canvas.height = window.screen.height;

const ctx = canvas.getContext('2d');

const UNIT_SIZE = 10;

let settings = {
    gameRunning: false,
    rows: Math.floor(canvas.height / UNIT_SIZE),
    columns: Math.floor(canvas.width / UNIT_SIZE),
    updatesPerSecond: 15,
    brushSize: 1
};

function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function fillRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function setBoard(board) {
    for(let row = 0; row < settings.rows; ++row) {
        board.push([]);
        for(let column = 0; column < settings.columns; ++column) {
            board[row].push(false);
        }
    }
}

function getNumberOfNeighbors(board, row, column) {
    let neighbors = 0;
    for(let rowShift = -1; rowShift <= 1; ++rowShift) {
        for(let columnShift = -1; columnShift <=1; ++columnShift) {
            if(rowShift == 0 && columnShift == 0) continue;
            try {
                if(board[row+rowShift][column+columnShift]) ++neighbors;
            } catch {}
        }
    }
    return neighbors;
}

function lifeCycle(board) {
    let oldBoard = JSON.parse(JSON.stringify(board)); //Creates a shallow copy
    for(let row = 0; row < board.length; ++row) {
        for(let column = 0; column < board[row].length; ++column) {
            if(oldBoard[row][column] && getNumberOfNeighbors(oldBoard, row, column) < 2) board[row][column] = false;
            else if(oldBoard[row][column] && getNumberOfNeighbors(oldBoard, row, column) <= 3) board[row][column] = true;
            else if(oldBoard[row][column] && getNumberOfNeighbors(oldBoard, row, column) > 3) board[row][column] = false;
            else if(!oldBoard[row][column] && getNumberOfNeighbors(oldBoard, row, column) == 3) board[row][column] = true;
        }
    }
}

function drawBoard(board) {
    clearCanvas(canvas, ctx);
    for(let row = 0; row < board.length; ++row) {
        for(let column = 0; column < board[row].length; ++column) {
            if(board[row][column]) {
                fillRect(ctx, column*UNIT_SIZE, row*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, "black");
            }
        }
    }
}

let board = [];
setBoard(board);

let mouse = {x:0, y:0, mousedown:false};

function setMousePosition(mouse, canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.x;
    mouse.y = event.clientY - rect.y
}

document.addEventListener("mousemove", (event) => {
    setMousePosition(mouse, canvas, event);
});

canvas.addEventListener("mousedown", (event)=>{
    mouse.mousedown = true;
});

canvas.addEventListener("mouseup", (event)=>{
    mouse.mousedown = false;
});

// Configuring all the HTML elements
let runButton = document.getElementById("run-button");
let stepButton = document.getElementById("step-button");
let clearButton = document.getElementById("clear-button");
let randomizeButton = document.getElementById("randomize-button");
let updatesPerSecondSlider = document.getElementById("ups-slider");
let updatesPerSecondNumber = document.getElementById("ups-number");
let brushSizeSlider = document.getElementById("brush-size-slider");
let brushSizeNumber = document.getElementById("brush-size-number");


runButton.onclick = () => {
    if(settings.gameRunning) {
        runButton.innerHTML = "Run";
    } else {
        runButton.innerHTML = "Pause";
    }
    settings.gameRunning = !settings.gameRunning;
};

stepButton.onclick = () => {
    lifeCycle(board);
    drawBoard(board);
};

clearButton.onclick = () => {
    for(let row = 0; row < board.length; ++row) {
        for(let column = 0; column < board[row].length; ++column) {
            board[row][column] = false;
        }
    }
    drawBoard(board);
}

randomizeButton.onclick = () => {
    for(let row = 0; row < board.length; ++row) {
        for(let column = 0; column < board[row].length; ++column) {
            let randomNumber = Math.floor(Math.random() * 2);
            if(randomNumber == 0) board[row][column] = false;
            else if(randomNumber == 1) board[row][column] = true;
        }
    }
    drawBoard(board);
}

updatesPerSecondSlider.value = settings.updatesPerSecond;
updatesPerSecondNumber.innerHTML = "Updates Per Second: " + updatesPerSecondSlider.value;
updatesPerSecondSlider.oninput = () => {
    updatesPerSecondNumber.innerHTML = "Updates Per Second: " + updatesPerSecondSlider.value;
    settings.updatesPerSecond = updatesPerSecondSlider.value;
};

brushSizeSlider.value = settings.brushSize;
brushSizeNumber.innerHTML = "Brush Size: " + brushSizeSlider.value;
brushSizeSlider.oninput = () => {
    brushSizeNumber.innerHTML = "Brush Size: " + brushSizeSlider.value;
    settings.brushSize = brushSizeSlider.value;
};

function paint(x, y, brushSize) {
    let oddSize = brushSize % 2 == 1;
    let start = Math.floor(oddSize ? brushSize / 2 : brushSize / 2 - 1);
    let end = Math.floor(brushSize / 2);
    for (let i = x - start; i <= x + end; i++) {
        for (let j = y - start; j <= y + end; j++) {
            if (i >= 0 && i < canvas.width && j >= 0 && j < canvas.height) {
                board[i][j] = true;
            }
        }
    }
}

window.setInterval(() => {
    if(mouse.mousedown) {
        let row = Math.floor(mouse.y / UNIT_SIZE);
        let col = Math.floor(mouse.x / UNIT_SIZE);
        paint(row, col, settings.brushSize);
        drawBoard(board);
    }
}, 1);

function gameLoop() {
    if(settings.gameRunning) {
        drawBoard(board);
        lifeCycle(board);
    }

    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000/settings.updatesPerSecond);
}

gameLoop();