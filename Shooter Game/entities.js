function isColliding(shape1, shape2) {
    return !(
        ((shape1.x + shape1.width) <= shape2.x) ||
        (shape1.x >= (shape2.x + shape2.width)) ||
        ((shape1.y + shape1.height) <= shape2.y) ||
        (shape1.y >= (shape2.y + shape2.height))
    );
}

const DEFAULT_SIZE = 25;
const DEFAULT_COLOR = "black";

class Entity {
    constructor(x, y, width=DEFAULT_SIZE, height=DEFAULT_SIZE, color=DEFAULT_COLOR) {
        this.type = "entity";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 0;
        this.canBeDeleted = false;
    }
    update() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }
    draw(camera) {
        fillRect(this.x, this.y, this.width, this.height, this.color, camera);
    }
}

class Player extends Entity {
    constructor(x, y, width=DEFAULT_SIZE, height=DEFAULT_SIZE, color=DEFAULT_COLOR) {
        super(x, y, width, height, color);
        this.type = "player";
        this.health = 100;
        this.absoluteX = this.x - camera.x;
        this.absoluteY = this.y - camera.y;
        this.speed = 0.2;
        this.friction = 0.9;
        this.handX = 0;
        this.handY = 0;
    }
    isTouchingEnemy() {
        for(let i = 0; i < entities.length; ++i) {
            if(entities[i].type == "enemy" && isColliding(this, entities[i])) {
                if(this.health > 0) {
                    --this.health;
                }
            }
        }
    }
    update() {
        if(keys["ArrowUp"] || keys['W'] || keys['w']) {
            this.yVelocity -= this.speed;
        }
        if(keys["ArrowDown"] || keys['S'] || keys['s']) {
            this.yVelocity += this.speed;
        }
        if(keys["ArrowLeft"] || keys['A'] || keys['a']) {
            this.xVelocity -= this.speed;
        }
        if(keys["ArrowRight"] || keys['D'] || keys['d']) {
            this.xVelocity += this.speed;
        }
        this.xVelocity *= this.friction;
        this.yVelocity *= this.friction;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.absoluteX = this.x - camera.x;
        this.absoluteY = this.y - camera.y;
        this.isTouchingEnemy();
    }
    drawHand() {
        const DISTANCE = 40;
        const HAND_SIZE = 4;
        let angle = Math.atan2(this.absoluteY - mouse.y, mouse.x - this.absoluteX);
        this.handX = this.x + this.width/2 + Math.cos(angle)*DISTANCE;
        this.handY = this.y + this.height/2 - Math.sin(angle)*DISTANCE;
        fillCircle(this.handX, this.handY, HAND_SIZE, this.color, camera);
    }
    draw() {
        fillRect(this.x, this.y, this.width, this.height, this.color, camera);
        this.drawHand();
    }
}

class Bullet extends Entity {
    constructor(x, y, width=5, height=5, color=DEFAULT_COLOR) {
        super(x, y, width, height, color);
        this.type = "bullet";
        let power = 5;
        let angle = Math.atan2(player.absoluteY - mouse.y, mouse.x - player.absoluteX);
        this.xVelocity = Math.cos(angle) * power;
        this.yVelocity = -Math.sin(angle) * power;
        this.speed = 3;
    }
    checkCollisions(entities) {
        for(let i = 0; i < entities.length; ++i) {
            if(entities[i].type == "enemy" && isColliding(this, entities[i])) {
                entities[i].canBeDeleted = true;
                this.canBeDeleted = true;
                break;
            }
        }
    }
    update(entities) {
        this.checkCollisions(entities);
        let BOOM = ()=>{this.canBeDeleted = true};
        setTimeout(BOOM, 300);
        this.x += this.xVelocity;
        this.y += this.yVelocity;        
    }
    draw(camera) {
        fillCircle(this.x, this.y, this.width, this.color, camera);
    }
}

/*
    ==Enemy Types==
    "zombie"
*/

class Enemy extends Entity {
    constructor(x, y, width, height, color, enemyType) {
        super(x, y, width, height, color);
        this.type = "enemy";
        this.enemyType = enemyType;
        this.speed = 0.75;
    }
    checkCollisions() {
        let horizontalRect = {
            x: this.x + this.xVelocity,
            y: this.y,
            width: this.width,
            height: this.height,
        };
        let verticalRect = {
            x: this.x,
            y: this.y + this.yVelocity,
            width: this.width,
            height: this.height,
        }
        for(let i = 0; i < entities.length; ++i) {
            if(isColliding(horizontalRect, entities[i]) && entities[i].type == "enemy" && entities[i] != this) {
                this.xVelocity = 0;
            }
            if(isColliding(verticalRect, entities[i]) && entities[i].type == "enemy" && entities[i] != this) {
                this.yVelocity = 0;
            }
        }
    }
    update() {
        if(this.x > player.x - player.width/2) {this.xVelocity = this.speed * -1;}
        else {this.xVelocity = this.speed * 1;}
        if(this.y > player.y - player.height/2) {this.yVelocity = this.speed * -1;}
        else {this.yVelocity = this.speed * 1;}
        this.checkCollisions();
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }
    draw(camera) {
        fillRect(this.x, this.y, this.width, this.height, this.color, camera);
        strokeRect(this.x, this.y, this.width, this.height, this.color, camera);
    }
}

/* collisions
    checkCollisions() {
        let horizontalRect = {
            x: this.x + this.xVelocity,
            y: this.y,
            width: this.width,
            height: this.height,
        };
        let verticalRect = {
            x: this.x,
            y: this.y + this.yVelocity,
            width: this.width,
            height: this.height,
        }
        for(let i = 0; i < entities.length; ++i) {
            if(isColliding(horizontalRect, entities[i]) && entities[i].type == "enemy") {
                while(isColliding(horizontalRect, entities[i])) {
                    horizontalRect.x -= Math.sign(this.xVelocity);
                }
                this.x = horizontalRect.x;
                this.xVelocity = 0;
            }
            if(isColliding(verticalRect, entities[i]) && entities[i].type == "enemy") {
                while(isColliding(verticalRect, entities[i])) {
                    verticalRect.y -= Math.sign(this.yVelocity);
                }
                this.y = verticalRect.y;
                this.yVelocity = 0;
            }
        }
    }
*/