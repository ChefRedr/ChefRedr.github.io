let hat = document.getElementById("logo");
let angle = 0;
let style;

hat.onclick = ()=>{
    angle += 90;
    transformation = `transform: rotate(${angle}deg)`
    hat.setAttribute("style", transformation);
}