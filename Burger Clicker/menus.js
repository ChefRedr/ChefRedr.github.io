let clickerSection = document.getElementById("clicker-section");
let menuItems = document.getElementById("menu-items");

let shopMenuButton = document.getElementById("shop-menu-icon");
let burgerSkinsButton = document.getElementById("burger-skins-icon");
let playerStatsButton = document.getElementById("player-stats-icon");
let achievementsButton = document.getElementById("achievements-icon");
let settingsButton = document.getElementById("settings-icon");

let shopMenu = document.getElementById("shop-menu");
let burgerSkinsMenu = document.getElementById("burger-skins-menu");
let playerStatsMenu = document.getElementById("player-stats-menu");
let achievementsMenu = document.getElementById("achievements-menu");
let settingsMenu = document.getElementById("settings-menu");

let backButtons = document.querySelectorAll(".back-button");

function hideMainScreen() {
    clickerSection.style.display = "none";
    menuItems.style.display = "none";
}

function hideAllMenus() {
    shopMenu.style.display = "none";
    burgerSkinsMenu.style.display = "none";
    playerStatsMenu.style.display = "none";
    achievementsMenu.style.display = "none";
    settingsMenu.style.display = "none";
}

backButtons.forEach(backButton => {
    backButton.onclick = ()=>{
        hideAllMenus();
        clickerSection.style.display = "flex";
        menuItems.style.display = "flex";
    }
});

shopMenuButton.onclick = ()=>{
    hideMainScreen();
    shopMenu.style.display = "grid";
}

burgerSkinsButton.onclick = ()=>{
    hideMainScreen()
    burgerSkinsMenu.style.display = "block";
}

playerStatsButton.onclick = ()=>{
    hideMainScreen()
    playerStatsMenu.style.display = "block";
}

achievementsButton.onclick = ()=>{
    hideMainScreen()
    achievementsMenu.style.display = "block";
}

settingsButton.onclick = ()=>{
    hideMainScreen()
    settingsMenu.style.display = "block";
}