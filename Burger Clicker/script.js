const FPS = 60;

class Worker {
    constructor(name, price, burgersPerSecond, imgURL, description="makes burgers idk") {
        this.name = name;
        this.owned = 0;
        this.price = price;
        this.burgersPerSecond = burgersPerSecond;
        this.productionMultiplier = 1;
        this.imgURL = imgURL;
        this.description = description;
        // this.locked = true;
    }
    updateHTML() {
        let html = document.getElementById(this.name);
        html.innerHTML = `
            <img class="worker-img" src="${this.imgURL}" alt="${this.name}.png">
            <p class="worker-description">${this.name} - <img src="images/burger.png" width="25px" height="25px">${Math.round(this.price)}<br>${this.description}</p>
            <p class="amount-owned">${this.owned}</p>
        `

    }
    getBurgersPerSecond() {
        return this.owned * this.burgersPerSecond * this.productionMultiplier;
    }
}

// Create when I add upgrades

// class Upgrade {
//     constructor(name, price) {
//         this.name = name;
//         this.price = price;
//     }
// }

let worker = {
    "Pointer": 0,
    "Cow": 1,
    "Plant": 2,
    "Grill": 3,
    "Bob": 4,
};

let workers = [];
workers[worker["Pointer"]] = (new Worker("Pointer", 15, 1, "images/workers/pointer2.png", "Clicks burgers for you so you don't have to"));
workers[worker["Cow"]] = (new Worker("Cow", 100, 7, "images/workers/cow.png", "More beef"));
workers[worker["Plant"]] = (new Worker("Plant", 1000, 90, "images/workers/plant.png", "Need to also make vegan burgers"));
workers[worker["Grill"]] = (new Worker("Grill", 12000, 750, "images/workers/grill.png", "It's better than using a microwave"));
workers[worker["Bob"]] = (new Worker("Bob", 150000, 2400, "images/workers/bob.png", "Crossed universes just to be here"));

let workerMenu = document.getElementById("worker-menu");

//Adds all the workers to the HTML
for(let i = 0; i < workers.length; ++i) {
    workerMenu.innerHTML += `
        <div class="worker" id="${workers[i].name}">
            <img class="worker-img" src="${workers[i].imgURL}" alt="${workers[i].name}.png">
            <p class="worker-description">${workers[i].name} - <img src="images/burger.png" width="25px" height="25px">${workers[i].price}<br>${workers[i].description}</p>
            <p class="amount-owned">${workers[i].owned}</p>
        </div>
    `;
}

const PRICE_MULTIPLIER = 1.15;

let burgers = 0;
let burgersPerClick = 1;
let autoBurgersPerSecond = 0;

let burgerButton = document.getElementById("burger-button");
let burgerAmountLabel = document.getElementById("burger-amount");
let shopBurgerAmountLabel = document.getElementById("shop-burger-amount");

burgerButton.onclick = ()=>{
    burgers += burgersPerClick;
}

//Makes workers buyable
for(let i = 0; i < workers.length; ++i) {
    document.getElementById(workers[i].name).onclick = ()=>{
        if(burgers >= workers[i].price) {
            burgers -= workers[i].price;
            ++workers[i].owned;
            workers[i].price *= PRICE_MULTIPLIER;
            workers[i].updateHTML();
        }
    }
}

function updateBurgerAmountLabel() {
    //Add millions, billions, etc
    burgerAmountLabel.innerHTML = `${Math.round(burgers)}`;
    shopBurgerAmountLabel.innerHTML = `Burgers: ${Math.round(burgers)}`
}

window.setInterval(()=>{
    burgers += autoBurgersPerSecond / FPS;
    for(let i = 0; i < workers.length; ++i) {
        burgers += workers[i].getBurgersPerSecond() / FPS;
    }
    updateBurgerAmountLabel();
}, 1000/FPS)