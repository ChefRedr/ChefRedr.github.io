const mapKey = {
    EMPTY_BLOCK: ' ',
    SOLID_BLOCK: '#',
    LEVEL_1_TELEPORTER: '1',
    LEVEL_2_TELEPORTER: '2',
    LEVEL_3_TELEPORTER: '3',
    LEVEL_4_TELEPORTER: '4',
};  

let currentMap;

levelSelectMap = [
    "############",
    "###1#2#3#4##",
    "### ########",
    "#          #",
    "#          #",
    "############",
];
currentMap = levelSelectMap;

level1Map = [
    "  #",
    "   ",
    "### #",
    "     ", //Character Spawns here, 2 column
    "## ",
    "#  ",
];