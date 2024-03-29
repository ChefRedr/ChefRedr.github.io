const FPS = 60;
let timeInterval;

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const TILE_UNIT_SIZE = 16;
const EDGE_UNIT_SIZE = 10;
const GAP_UNIT_SIZE = 6;
const TIMER_UNIT_SIZE = 13;
const SMILEY_UNIT_SIZE = 26;
const BACKGROUND_COLOR = "#C0C0C0";

function drawImage(imgURL, x, y) {
    let image = new Image();
    image.onload = ()=>{
        ctx.drawImage(image, x, y);
    }
    image.src = imgURL;
}

function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function fillRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

const tiles = {
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
    TOP_LEFT_CORNER: "images/top_left_corner.png",
    TOP_RIGHT_CORNER: "images/top_right_corner.png",
    BOTTOM_LEFT_CORNER: "images/bottom_left_corner.png",
    BOTTOM_RIGHT_CORNER: "images/bottom_right_corner.png",
    HORIZONTAL_EDGE: "images/horizontal_edge.png",
    VERTICAL_EDGE: "images/vertical_edge.png",
    CONNECTING_LEFT: "images/connecting_left.png",
    CONNECTING_RIGHT: "images/connecting_right.png",
    TIMER_0: "images/0_timer.png",
    TIMER_1: "images/1_timer.png",
    TIMER_2: "images/2_timer.png",
    TIMER_3: "images/3_timer.png",
    TIMER_4: "images/4_timer.png",
    TIMER_5: "images/5_timer.png",
    TIMER_6: "images/6_timer.png",
    TIMER_7: "images/7_timer.png",
    TIMER_8: "images/8_timer.png",
    TIMER_9: "images/9_timer.png",
};

let mouse = {x: 0, y: 0};

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
        // Rows: Min value is 1 and max is 99
        // Columns: Min value is 8 and max value is 99
        this.rows = (rows < 1) ? 1 : (rows > 99 ? 99 : rows);
        this.columns = (columns < 8) ? 8 : (columns > 99 ? 99 : columns);

        // numberOfBombs: Min value is 0 and max value is rows*columns - 1
        this.numberOfBombs = Math.min(Math.max(numberOfBombs, 0), this.rows * this.columns - 1);

        this.board = [];
        this.gameStarted = false;
        this.gameRunning = false;
        this.stopwatch = 0;
    }
    resizeCanvas() {
        canvas.x = 0;
        canvas.y = 0;
        canvas.width = this.columns * TILE_UNIT_SIZE;
        canvas.height = this.rows * TILE_UNIT_SIZE;
    }
    constructBoard() {
        this.board = [];
        for(let row = 0; row < this.rows; ++row) {
            this.board.push([]);
            for(let column = 0; column < this.columns; ++column) {
                this.board[row].push(new BoardTile());
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
    placeBombs(safeRow, safeColumn) { //Add safeTile back
        let bombsLeft = this.numberOfBombs;
        while(bombsLeft > 0) {
            let randomRow = Math.floor(Math.random() * this.rows);
            let randomColumn = Math.floor(Math.random() * this.columns);
            // if(randomRow == safeRow && randomColumn == safeColumn) continue;
            if(!this.board[randomRow][randomColumn].isBomb) {
                this.board[randomRow][randomColumn].isBomb = true;
                --bombsLeft;
            }
        }
    }
    assignNumbers() {
        for(let r = 0; r < this.rows; ++r) {
            for(let c = 0; c < this.columns; ++c) {
                let neighboringBombs = 0;
                if(this.board[r][c].isBomb) continue;
                else {
                    for(let rowShift = -1; rowShift <= 1; ++rowShift) {
                        for(let columnShift = -1; columnShift <=1; ++columnShift) {
                            if(rowShift == 0 && columnShift == 0) continue;
                            try {
                                if(this.board[r+rowShift][c+columnShift].isBomb) ++neighboringBombs;
                            } catch {}
                        }
                    }
                    this.board[r][c].neighboringBombs = neighboringBombs;
                }
            }
        }
    }
    drawBoard() {
        for(let r = 0; r < this.board.length; ++r) {
            for(let c = 0; c < this.board[r].length; ++c) {
                if(!this.board[r][c].isPressed) {
                    if(this.board[r][c].isFlagged) { drawImage(tiles.FLAGGED_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                    else if(this.board[r][c].isQuestionMarked) { drawImage(tiles.QUESTION_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                    // Display the symbols
                    else if(this.board[r][c].isBomb) { drawImage(tiles.BOMB_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                    else {
                        let translatedTile = `TILE_${this.board[r][c].neighboringBombs}`;
                        if(translatedTile == "TILE_0") { drawImage(tiles.EMPTY_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                        else { drawImage(tiles[translatedTile], c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                    }
                    //else { drawImage(tiles.UNPRESSED_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                }
                else if(this.board[r][c].isPressed) {
                    let translatedTile = "TILE_" + String(this.board[r][c].neighboringBombs);
                    if(translatedTile == "TILE_0") { drawImage(tiles.EMPTY_TILE, c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                    else { drawImage(tiles[translatedTile], c*TILE_UNIT_SIZE, r*TILE_UNIT_SIZE); }
                }
            }
        }
    }
    tilePress(row, column) {
        
    }
    tileRightPress() {
        
    }
    startGame() {
        this.resizeCanvas();
        this.constructBoard();
        this.placeBombs();      //Rework this
        this.assignNumbers();   //Rework this
        this.displayArray(); // Remove this later
        // this.drawBoard();

        canvas.onclick = () => {

        }

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

// Above connecting edges
let shift = 10;
let lines = 8;
drawImage(tiles.TOP_LEFT_CORNER, 0, 0);
for(let i = 0; i < lines; ++i) {
    drawImage(tiles.HORIZONTAL_EDGE, shift, 0);
    shift += 16;
}
drawImage(tiles.TOP_RIGHT_CORNER, shift, 0);
drawImage(tiles.VERTICAL_EDGE, 0, EDGE_UNIT_SIZE);
drawImage(tiles.VERTICAL_EDGE, 0, EDGE_UNIT_SIZE+TILE_UNIT_SIZE);
drawImage(tiles.VERTICAL_EDGE, shift, EDGE_UNIT_SIZE);
drawImage(tiles.VERTICAL_EDGE, shift, EDGE_UNIT_SIZE+TILE_UNIT_SIZE);
drawImage(tiles.CONNECTING_LEFT, 0, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE+GAP_UNIT_SIZE);
shift = 10;
for(let i = 0; i < lines; ++i) {
    drawImage(tiles.HORIZONTAL_EDGE, shift, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE+GAP_UNIT_SIZE);
    shift += 16;
}
drawImage(tiles.CONNECTING_RIGHT, shift, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE+GAP_UNIT_SIZE);

// Smiley and timer
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE+EDGE_UNIT_SIZE, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE*2, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);
drawImage(tiles.SMILEY_FACE_TILE, GAP_UNIT_SIZE*2+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE*3, GAP_UNIT_SIZE*0.75+EDGE_UNIT_SIZE);
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE*3+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE*3+SMILEY_UNIT_SIZE, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE*3+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE*4+SMILEY_UNIT_SIZE, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);
drawImage(tiles.TIMER_0, GAP_UNIT_SIZE*3+EDGE_UNIT_SIZE+TIMER_UNIT_SIZE*5+SMILEY_UNIT_SIZE, GAP_UNIT_SIZE+EDGE_UNIT_SIZE);  

// Vertical edges below connecting edges
drawImage(tiles.VERTICAL_EDGE, 0, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*2);
drawImage(tiles.VERTICAL_EDGE, 0, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*3);
drawImage(tiles.VERTICAL_EDGE, shift, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*2);
drawImage(tiles.VERTICAL_EDGE, shift, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*3);

// Tiles and Bottom border
for(let h = 0; h < 2; ++h) {
    for(let i = 0; i < 8; ++i) {
        drawImage(tiles.UNPRESSED_TILE, EDGE_UNIT_SIZE+TILE_UNIT_SIZE*i, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*(2+h));
        drawImage(tiles.HORIZONTAL_EDGE, EDGE_UNIT_SIZE+TILE_UNIT_SIZE*i, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*4);
    }
}

// Bottom corners
drawImage(tiles.BOTTOM_LEFT_CORNER, 0, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*4);
drawImage(tiles.BOTTOM_RIGHT_CORNER, EDGE_UNIT_SIZE+TILE_UNIT_SIZE*8, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*4);

fillRect(ctx, 0, 0, EDGE_UNIT_SIZE*2+TILE_UNIT_SIZE*8, EDGE_UNIT_SIZE*3+TILE_UNIT_SIZE*4, BACKGROUND_COLOR);

