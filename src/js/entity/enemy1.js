import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Healing } from "../buffer/healing.js";
import { Boost } from "../buffer/boost.js";

export class Enemy1 extends PIXI.Container {
    constructor() {
        super();
        this.enemySize = 100;
        const enemyTexture = PIXI.Texture.from('enemy1');
        this.enemySprite = new PIXI.Sprite(enemyTexture);
        this.enemySprite.anchor.set(0.5);
        this.addChild(this.enemySprite);
        this.position.set(this.randomSpawnPoint(), 0); 
        this.speed = 4;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.zIndex = 1;
        this.attacking = false;

    }

    // get position() {
    //     return this.position;
    // }

    // get width() {
    //     return this.width;
    // }

    // get height() {
    //     return this.height;
    // }

    // get getBounds() {
    //     return this.getBounds();
    // }


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
        this.drop();
        this.destroy();

    }
    update(delta) {
        this.y += this.speed * delta;
        if (this.y > Manager.width * 2) {
            this.y = 0;
            this.x = this.randomSpawnPoint();
            this.attacking = false;
        }

        if (this.rectsIntersect({ a: Manager.player, b: this })) {
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

    drop() {
        const buff = new Healing();
        buff.position.set(this.x, this.y);
        Manager.bufferHandle.addChild(buff);
        Manager.bufferHandle.addBuff(buff);
    }
}