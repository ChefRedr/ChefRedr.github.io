const UNIT_SIZE = 100;

let map = [
    "##################################################",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "#                                                #",
    "##################################################",
];

function drawMap() {
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[i].length; ++j) {
            if(map[i][j] == "#") {
                fillRect(j*UNIT_SIZE, i*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, "red", camera);
            }
        }
    }
    drawMiniMap();
}

function drawMiniMap() {
    let mapWidth = 125;
    let mapHeight = 125;
    ctx.fillStyle = "white";
    ctx.fillRect(document.documentElement.clientWidth - mapWidth - 5, 5, mapWidth, mapHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(document.documentElement.clientWidth - mapWidth - 5, 5, mapWidth, mapHeight);
    let miniUnitSize = UNIT_SIZE/40;
    for(let i = 0; i < map.length; ++i) {
        for(let j = 0; j < map[i].length; ++j) {
            let x = document.documentElement.clientWidth - mapWidth - 5 + j*miniUnitSize;
            let y = 5 + i*miniUnitSize;
            if(map[i][j] == "#") {
                ctx.fillStyle = "red";
                ctx.fillRect(x, y, miniUnitSize, miniUnitSize);
            }
        }
    }
    for(let i = 0; i < entities.length; ++i) {
        if(entities[i].type != "bullet") {
            ctx.fillStyle = "black";
            let x = (document.documentElement.clientWidth - mapWidth - 5 + (entities[i].x/40));
            let y = (5 + (entities[i].y/40));
            ctx.fillRect(x, y, miniUnitSize, miniUnitSize);
        }
    }
}