let events = [
    "Hello",
    "World",
];

/*
    Wave 1: 10 Zombies;
    Wave 2: 20 Zombies;
    Wave 3: 30 Zombies;
    Wave 4: 40 Zombies
*/

let eventBoxHeight = 300;
let eventBoxWidth = 250;

function drawEvents() {
    if(events.length > 15) {events.shift();}
    ctx.font = '16px Arial';
    ctx.fillStyle = "black";
    for(let i = 0; i < events.length; ++i) {
        let x = document.documentElement.clientWidth - eventBoxWidth + 5;
        let y = document.documentElement.clientHeight - 5 - (20*i);
        ctx.fillText(events[i], x, y);
    }
}

function drawEventsBox() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(document.documentElement.clientWidth - eventBoxWidth, document.documentElement.clientHeight - eventBoxHeight, eventBoxWidth, eventBoxHeight);
    ctx.strokeRect(document.documentElement.clientWidth - eventBoxWidth, document.documentElement.clientHeight - eventBoxHeight, eventBoxWidth, eventBoxHeight);
    drawEvents();
}