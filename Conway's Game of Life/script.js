let canvas = document.getElementById("canvas");

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let c = canvas.getContext('2d');

const drawLine = (x1, y1, x2, y2) => {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
}

let gameRunning = false;

let rowSlider = document.getElementById("row-slider");
let rowOutput = document.getElementById("row-number");
rowOutput.innerHTML = "Rows: "+rowSlider.value;

let timeSlider = document.getElementById("time-slider");
let timeOutput = document.getElementById("time-number");
timeOutput.innerHTML = "Updates per Second: "+timeSlider.value;

const DEFAULT_ROWS = rowSlider.value;

let settings = {
    rows: DEFAULT_ROWS,
    unitSize: CANVAS_SIZE/DEFAULT_ROWS,
    updatesPerSecond: timeSlider.value,
}

// Update the current slider value (each time you drag the slider handle)
rowSlider.oninput = () => {
    gameRunning = false;
    rowOutput.innerHTML = "Rows: "+rowSlider.value;
    setMap(rowSlider.value);
    settings.rows = rowSlider.value;
    settings.unitSize = CANVAS_SIZE/settings.rows;
    startButton.innerHTML = "Start";
    drawBoard();
}

timeSlider.oninput = () => {
    timeOutput.innerHTML = "Updates per Second: "+timeSlider.value;
    settings.updatesPerSecond = timeSlider.value;
    window.clearInterval(timeInterval);
    timeInterval = window.setInterval(()=>{
        if(gameRunning) {
            lifeCycle();
        }
    }, 1000/settings.updatesPerSecond);
}

let map = [];
setMap(settings.rows);

//initialize all new boxes with 0
function setMap(rows) {
    let newMap = [];
    for(let i = 0; i < rows; ++i) {
        newMap.push([]);
        for(let j = 0; j < rows; ++j) {
            newMap[i].push(0);
        }
    }
    map = newMap;
}

const drawBoard = () => {
    c.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for(i = 0; i < map.length; ++i) {
        for(j = 0; j < map.length; ++j) {
            if(map[i][j] == 0) { c.fillStyle = "white"; }
            else if(map[i][j] == 1) { c.fillStyle = "red"; }
            c.fillRect(j*settings.unitSize, i*settings.unitSize, settings.unitSize, settings.unitSize);
        }
    }
    c.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for(let i = 1; i < settings.rows; ++i) {
        drawLine(0, i*settings.unitSize, CANVAS_SIZE, i*settings.unitSize); //draws horizontal lines
        drawLine(i*settings.unitSize, 0, i*settings.unitSize, CANVAS_SIZE); //draws vertical lines
    }
}

drawBoard();

let array = document.getElementById("array");
const displayArray = () => {
    array.innerHTML = "";
    for(let i = 0; i < map.length; ++i) {
        array.innerHTML += `${map[i]}<br>`;
    }
};

let mouse = {
    x: 0,
    y: 0,
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y,
    };
}

document.addEventListener("mousemove", (e) => {
    mouse = getMousePosition(canvas, e);
});

function clickBox() {
    gameRunning = false;
    startButton.innerHTML = "Start";
    let row = Math.floor(mouse.y/settings.unitSize);
    let column = Math.floor(mouse.x/settings.unitSize);
    if(map[row][column] == 0) { map[row][column] = 1; }
    else { map[row][column] = 0; }
    drawBoard();
}

function lifeCycle() {
    let copyMap = [];
    for(let i = 0; i < map.length; ++i) {
        copyMap.push([]);
        for(let j = 0; j < map.length; ++j) {
            copyMap[i][j] = Number(map[i][j]);
        }
    }
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map.length; ++j) {
            let neighbors = getNeighbors(i, j, copyMap);
            if(copyMap[i][j] == 0) {
                if(neighbors == 3) { map[i][j] = 1; }
            }
            if(copyMap[i][j] == 1) {
                if(neighbors < 2) { map[i][j] = 0; }
                if(neighbors > 3) { map[i][j] = 0; }
            }
        }
    }
    drawBoard();
}

function getNeighbors(row, column, arr) {
    let neighbors = 0;
    let reachedTop = (row-1 == -1);
    let reachedBottom = (row+1 == arr.length);
    let reachedLeft = (column-1 == -1);
    let reachedRight = (column+1 == arr.length);

    if(!reachedTop && !reachedLeft && arr[row-1][column-1] == 1) { ++neighbors; }
    if(!reachedTop && arr[row-1][column] == 1) { ++neighbors; }
    if(!reachedTop && !reachedRight && arr[row-1][column+1] == 1) { ++neighbors; }
    if(!reachedLeft && arr[row][column-1] == 1) { ++neighbors; }
    if(!reachedRight && arr[row][column+1] == 1) { ++neighbors; }
    if(!reachedBottom && !reachedLeft && arr[row+1][column-1] == 1) { ++neighbors; }
    if(!reachedBottom && arr[row+1][column] == 1) { ++neighbors; }
    if(!reachedBottom && !reachedRight && arr[row+1][column+1] == 1) { ++neighbors; }
    return neighbors;
}

let startButton = document.getElementById("start-button");
let stepButton = document.getElementById("step-button");

startButton.onclick = () => {
    gameRunning = !gameRunning;
    if(gameRunning) { startButton.innerHTML = "Pause"; }
    if(!gameRunning) { startButton.innerHTML = "Start"; }
}

stepButton.onclick = () => {
    lifeCycle();
}

let timeInterval = window.setInterval(()=>{
    if(gameRunning) {
        lifeCycle();
    }
}, 1000/settings.updatesPerSecond);