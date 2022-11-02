function colliding(shape1, shape2) {
    if((shape1.x + shape1.size) > shape2.x && shape1.x < (shape2.x + shape2.size) && (shape1.y + shape1.size) > shape2.y && shape1.y < (shape2.y + shape2.size)) {
        return true;
    }
}

class Entity {
    constructor(x, y, size, color="black") {
        this.type = "entity";
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.speed = 0;
    }
    draw(camera) {
        fillRect(this.x, this.y, this.size, this.size, this.color, camera);
    }
}

class Player extends Entity {
    constructor(x, y, size, color) {
        super(x, y, size, color);
        this.type = "player";
        this.absoluteX = this.x - camera.x;
        this.absoluteY = this.y - camera.y;
        this.speed = 0.05;
        this.friction = 0.9;
        this.handX = 0;
        this.handY = 0;
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
    }
    drawHand() {
        const DISTANCE = 40;
        const HAND_SIZE = 4;
        let angle = Math.atan2(this.absoluteY - mouse.y, mouse.x - this.absoluteX);
        this.handX = this.x + this.size/2 + Math.cos(angle)*DISTANCE;
        this.handY = this.y + this.size/2 - Math.sin(angle)*DISTANCE;
        fillCircle(this.handX, this.handY, HAND_SIZE, this.color, camera);
    }
    draw() {
        fillRect(this.x, this.y, this.size, this.size, this.color, camera);
        this.drawHand();
    }
}

class Bullet extends Entity {
    constructor(x, y, size=5, color) {
        super(x, y, size, color);
        this.type = "bullet";
        this.power = 5;
        let angle = Math.atan2(player.absoluteY - mouse.y, mouse.x - player.absoluteX);
        this.xVelocity = Math.cos(angle) * this.power;
        this.yVelocity = -Math.sin(angle) * this.power;
        this.speed = 3;
    }
    checkCollisions(entities) {
        for(let i = 0; i < entities.length; ++i) {
            // alert(`${entities[i].type}, ${colliding(this, entities[i])}`);
            if(entities[i].type = "enemy" && colliding(this, entities[i])) {
                entities[i].color = "red";
            }
        }
    }
    update(entities) {
        this.checkCollisions(entities);
        this.x += this.xVelocity;
        this.y += this.yVelocity;        
    }
    draw(camera) {
        fillCircle(this.x, this.y, this.size, this.color, camera);
    }
}

/*
    ==Enemy Types==
    "zombie"
*/

class Enemy extends Entity {
    constructor(x, y, size, color, enemyType) {
        super(x, y, size, color);
        this.type = "enemy";
        this.enemyType = enemyType;
    }
    update() {

    }
}