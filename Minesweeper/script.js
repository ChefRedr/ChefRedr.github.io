const FPS = 60;
let timeInterval;

let canvas = document.getElementById("canvas");
canvas.oncontextmenu = ()=>{ return false; }
const ctx = canvas.getContext('2d');
const UNIT_SIZE = 16;

function drawImage(imgURL, x, y) {
    let image = new Image();
    image.onload = ()=>{
        ctx.drawImage(image, x, y);
    }
    image.src = imgURL;
}

let tiles = {
    UNPRESSED_TILE:"images/unpressed_tile.png",
    EMPTY_TILE: "images/empty_tile.png",
    TILE_1: "images/1_tile.png",
    TILE_2: "images/2_tile.png",
    TILE_3: "images/3_tile.png",
    TILE_4: "images/4_tile.png",
    TILE_5: "images/5_tile.png",
    TILE_6: "images/6_tile.png",
    TILE_7: "images/7_tile.png",
    TILE_8: "images/8_tile.png",
    BOMB_TILE: "images/bomb_tile.png",
    PRESSED_BOMB_TILE: "images/pressed_bomb_tile.png",
    WRONG_BOMB_TILE: "images/wrong_bomb_tile.png",
    FLAGGED_TILE: "images/flagged_tile.png",
    QUESTION_TILE: "images/question_tile.png",
    PRESSED_QUESTION_TILE: "images/pressed_question_tile.png",
    SMILEY_FACE_TILE: "images/smiley_face_tile.png",
    PRESSED_SMILEY_FACE_TILE: "images/pressed_smiley_face_tile.png",
    SURPRISED_SMILEY_FACE_TILE: "images/surprised_smiley_face_tile.png",
    COOL_SMILEY_FACE_TILE: "images/cool_smiley_face_tile.png",
    DEAD_SMILEY_FACE_TILE: "images/dead_smiley_face_tile.png",
};

let mouse = {
    x: 0,
    y: 0,
    leftDown: false
};

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y,
    };
}

document.addEventListener("mousemove", (e) => {
    mouse = getMousePosition(canvas, e);
    document.getElementById("mouse-cords").innerHTML = `X:${Math.floor(mouse.x)}, Y:${Math.floor(mouse.y)}`;
});

class BoardTile {
    constructor(isBomb = false, neighboringBombs = null) {
        this.isBomb = isBomb;
        this.neighboringBombs = neighboringBombs;
        this.isFlagged = false;
        this.isQuestionMarked = false;
        this.isPressed = false;
        this.active = false;
    }
}

class Board {
    constructor(rows, columns, numberOfBombs) {
        //Set rows and columns
            if(rows <= 0) { this.rows = 1; } else { this.rows = rows; }
            if(columns < 8) { this.columns = 8; } else { this.columns = columns; }
        //Set number of bombs
            if(numberOfBombs >= this.rows*this.columns) { this.numberOfBombs = this.rows*this.columns - 1; }
            else if(numberOfBombs < 0) { this.numberOfBombs = 0; }
            else { this.numberOfBombs = numberOfBombs; }
        this.board = [];
        this.currentlyActiveTile = null;
        this.gameStarted = false;
        this.gameRunning = false;
        this.stopwatch = 0;
    }
    resizeCanvas() {
        canvas.x = 0;
        canvas.y = 0;
        canvas.width = this.columns * UNIT_SIZE;
        canvas.height = this.rows * UNIT_SIZE;
    }
    constructBoard() {
        this.board = [];
        for(let r = 0; r < this.rows; ++r) {
            this.board.push([]);
            for(let c = 0; c < this.columns; ++c) {
                this.board[r].push(new BoardTile());
            }
        }
    }
    displayArray() { //remove
        let array = document.getElementById("array");
        array.innerHTML = "";
        for(let i = 0; i < this.board.length; ++i) {
            for(let j = 0; j < this.board[i].length; ++j) {
                array.innerHTML += `${this.board[i][j].neighboringBombs}, `;
            }
            array.innerHTML += `<br>`;
        }
    }
    placeBombs() { //Add safeTile back
        let bombsLeft = this.numberOfBombs;
        while(bombsLeft > 0) {
            let randomRow = Math.floor(Math.random() * this.rows);
            let randomColumn = Math.floor(Math.random() * this.columns);
            if(!this.board[randomRow][randomColumn].isBomb) {
                this.board[randomRow][randomColumn].isBomb = true;
                --bombsLeft;
            }
        }
    }
    assignNumbers() {
        for(let r = 0; r < this.rows; ++r) {
            for(let c = 0; c < this.columns; ++c) {
                if(this.board[r][c].isBomb) { this.board[r][c].neighboringBombs = 9; }
                else {
                    let neighboringBombs = 0;
                    let reachedTop = (r-1 == -1);
                    let reachedBottom = (r+1 == this.board.length);
                    let reachedLeft = (c-1 == -1);
                    let reachedRight = (c+1 == this.board[r].length);

                    if(!reachedTop && !reachedLeft && this.board[r-1][c-1].isBomb) { ++neighboringBombs; }
                    if(!reachedTop && this.board[r-1][c].isBomb) { ++neighboringBombs; }
                    if(!reachedTop && !reachedRight && this.board[r-1][c+1].isBomb) { ++neighboringBombs; }
                    if(!reachedLeft && this.board[r][c-1].isBomb) { ++neighboringBombs; }
                    if(!reachedRight && this.board[r][c+1].isBomb) { ++neighboringBombs; }
                    if(!reachedBottom && !reachedLeft && this.board[r+1][c-1].isBomb) { ++neighboringBombs; }
                    if(!reachedBottom && this.board[r+1][c].isBomb) { ++neighboringBombs; }
                    if(!reachedBottom && !reachedRight && this.board[r+1][c+1].isBomb) { ++neighboringBombs; }

                    this.board[r][c].neighboringBombs = neighboringBombs;
                }
            }
        }
    }
    drawBoard() {
        ctx.clearRect(canvas.x, canvas.y, canvas.width, canvas.height);
        for(let r = 0; r < this.board.length; ++r) {
            for(let c = 0; c < this.board[r].length; ++c) {
                if(!this.board[r][c].isPressed) {
                    if(this.board[r][c].isFlagged) { drawImage(tiles.FLAGGED_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                    else if(this.board[r][c].isQuestionMarked) { drawImage(tiles.QUESTION_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                    else if(this.board[r][c].isQuestionMarked && this.board[r][c].active) { drawImage(tiles.PRESSED_QUESTION_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                    else { drawImage(tiles.UNPRESSED_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                }
                else if(this.board[r][c].isPressed) {
                    let translatedTile = "TILE_" + String(this.board[r][c].neighboringBombs);
                    if(translatedTile == "TILE_0") { drawImage(tiles.EMPTY_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                    else { drawImage(tiles[translatedTile], c*UNIT_SIZE, r*UNIT_SIZE); }
                }
            }
        }
    }
    tilePress(row, column) {
        
    }
    tileRightPress(row, column) {
        
    }
    startGame() {
        this.resizeCanvas();
        this.constructBoard();
        this.placeBombs();      //Rework this
        this.assignNumbers();   //Rework this
        this.drawBoard();

        canvas.addEventListener('mousedown', (event)=>{
            if(event.button == 0) {
                console.log("Left Down");
                mouse.leftDown = true;
            }
        });
        
        canvas.addEventListener('mouseup', (event)=>{
            if(event.button == 0) {
                console.log("Left Up");
                mouse.leftDown = false;
            }
        });
        //Rewrite this

        // canvas.onclick = ()=>{
        //     if(mouse.x >= canvas.x && mouse.x <= canvas.width && mouse.y >= canvas.y && mouse.y <= canvas.height) {
        //         if(this.gameRunning) { this.tilePress(); }
        //     }
        // };

        // canvas.oncontextmenu = ()=>{
        //     if(mouse.x >= canvas.x && mouse.x <= canvas.width && mouse.y >= canvas.y && mouse.y <= canvas.height) {
        //         if(this.gameRunning) { this.tileRightPress(); }
        //         return false;
        //     }
        // }
    }
    gameLoop() {
        if(mouse.leftDown) {
            if(!this.currentlyActiveTile == null) { this.currentlyActiveTile.active = false; }
            this.currentlyActiveTile = this.board[Math.floor(mouse.y/UNIT_SIZE), Math.floor(mouse.x/UNIT_SIZE)];
            this.currentlyActiveTile.active = true;
        }
        else {
            if(!this.currentlyActiveTile == null) { this.currentlyActiveTile.active = false; }
            this.currentlyActiveTile = null;
        }
    }
}

minesweeperBoard = new Board(16, 16, 40);
minesweeperBoard.startGame();

window.setInterval(()=>{
    minesweeperBoard.gameLoop();
}, 1000/FPS);