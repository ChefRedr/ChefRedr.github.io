const FPS = 60;
let timeInterval;

let canvas = document.getElementById("canvas");
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

function BoardTile(isBomb = false, neighboringBombs = null, isFlagged = false, isQuestionMarked = false, isPressed = false) {
    this.isBomb = isBomb;
    this.neighboringBombs = neighboringBombs;
    this.isFlagged = isFlagged;
    this.isQuestionMarked = isQuestionMarked;
    this.isPressed = isPressed;
}

class Board {
    constructor(rows, columns, numberOfBombs) {
        if(rows <= 0) { this.rows = 1; }
        else { this.rows = rows; }
        if(columns < 8) { this.columns = 8; }
        else { this.columns = columns; }
        if(numberOfBombs >= this.rows*this.columns) { this.numberOfBombs = this.rows*this.columns - 1; }
        else { this.numberOfBombs = numberOfBombs; }
        this.board = [];
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
        for(let r = 0; r < this.board.length; ++r) {
            for(let c = 0; c < this.board[r].length; ++c) {
                if(!this.board[r][c].isPressed) {
                    if(this.board[r][c].isFlagged) { drawImage(tiles.FLAGGED_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
                    else if(this.board[r][c].isQuestionMarked) { drawImage(tiles.QUESTION_TILE, c*UNIT_SIZE, r*UNIT_SIZE); }
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
    tilePress() {
        
    }
    tileRightPress() {
        
    }
    startGame() {
        this.resizeCanvas();
        this.constructBoard();
        this.placeBombs();      //Rework this
        this.assignNumbers();   //Rework this
        this.drawBoard();

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
}

minesweeperBoard = new Board(16, 16, 40);
minesweeperBoard.startGame();