let colorMode = 0;
let currentFont = 0;
let fonts = ['Arial', 'Times New Roman', 'Impact', 'Verdana'];

const LIGHT_GRAY = "#e4e4e4";
const DARK_GRAY = "#323232";

let currentColorMode = 0;
let colorButton = document.getElementById("theme-button");
let fontButton = document.getElementById("font-adjustor");

let navBars = document.getElementsByTagName("nav");
let body = document.getElementById("body");
let alt_backs = document.getElementsByClassName("alt-back");

function lightMode() {
    for(let i = 0; i < navBars.length; i++) {
        navBars[i].style.backgroundColor = LIGHT_GRAY;
    }
    body.style.backgroundColor = "white";
    body.style.color = "black";
    for(let i = 0; i < alt_backs.length; i++) {
        alt_backs[i].style.backgroundColor = LIGHT_GRAY;
    }
}

function darkMode() {
    for(let i = 0; i < navBars.length; i++) {
        navBars[i].style.backgroundColor = DARK_GRAY;
    }
    body.style.backgroundColor = "black";
    body.style.color = "white";
    for(let i = 0; i < alt_backs.length; i++) {
        alt_backs[i].style.backgroundColor = DARK_GRAY;
    }
}

colorButton.onclick = () => {
    if(colorMode == 0) {
        darkMode();
        colorMode = 1;
        colorButton.textContent = "Dark Mode";
    }
    else {
        lightMode();
        colorMode = 0;
        colorButton.textContent = "Light Mode";
    }
};

lightMode();

fontButton.onclick = () => {
    if(currentFont == fonts.length - 1) {
        currentFont = 0;
    }
    else { 
        currentFont += 1;
    }
    body.style.fontFamily = fonts[currentFont];
    fontButton.textContent = fonts[currentFont];
};