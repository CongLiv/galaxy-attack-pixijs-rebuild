import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";

export class Enemy1 extends PIXI.Container {
    constructor() {
        super();
        this.enemySize = 100;
        const enemyTexture = PIXI.Texture.from('enemy1');
        this.enemy = new PIXI.Sprite(enemyTexture);
        this.enemy.anchor.set(0.5);
        this.enemy.position.set(this.randomSpawnPoint(), 0);
        this.addChild(this.enemy);
        this.speed = 4;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.zIndex = 1;
        this.attacking = false;

    }

    get position() {
        return this.enemy.position;
    }

    get width() {
        return this.enemy.width;
    }

    get height() {
        return this.enemy.height;
    }

    get getBounds() {
        return this.enemy.getBounds();
    }


    attack() {

        if (this.attacking) return;
        this.attacking = true;
        console.log("Enemy attacked");
        this.interval = setInterval(() => {
            Manager.player.attacked();
            clearInterval(this.interval); // Dừng việc giảm health sau một khoảng thời gian 
        }, 200);

    }

    attacked() {
        this.health -= 10;
        this.alpha = 0.7;
        setTimeout(() => {
            this.alpha = 1;
        }, 300);
    }

    kill() {

        Manager.player.point = Manager.player.point + 1;
        this.enemy.destroy();

    }
    update(delta) {
        this.enemy.y += this.speed * delta;
        if (this.enemy.y > Manager.width * 2) {
            this.enemy.y = 0;
            this.enemy.x = this.randomSpawnPoint();
            this.attacking = false;
        }

        if (this.rectsIntersect({ a: Manager.player, b: this.enemy })) {
            this.attack();
            return;
        }
    }

    rectsIntersect({ a, b }) {
        // Kiểm tra xem hai hình chữ nhật có giao nhau hay không
        return (
            a.position.x - 64 + a.width > b.position.x - 50 &&
            a.position.x - 64 < b.position.x - 50 + b.width &&
            a.position.y - 64 + a.height > b.position.y - 50 &&
            a.position.y - 64 < b.position.y + b.height - 50
        );
    }


    randomSpawnPoint() {
        let randNum = Math.floor(Math.random() * 4);
        let spawnPointX = 64 + randNum * 128;
        return spawnPointX;
    }
}