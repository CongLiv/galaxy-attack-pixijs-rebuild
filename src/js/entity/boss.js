import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Healing } from "../buffer/healing.js";
import { Boost } from "../buffer/boost.js";
import { BossBullet } from "./bossbullet.js";

export class Boss extends PIXI.Container {

    constructor() {
        super();
        this.type = 'boss';
        this.sortableChildren = true;
        const enemySprite = PIXI.Texture.from('boss');
        this.enemySprite = new PIXI.Sprite(enemySprite);
        this.enemySprite.zIndex = 1;
        this.enemySprite.anchor.set(0.5);
        this.addChild(this.enemySprite);

        this.bossBullet = new BossBullet(this);
        this.bossBullet.zIndex = 2;
        Manager.currentScene.addChild(this.bossBullet);

        this.speed = 1;
        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.attacking = false;
        this.zIndex = 1;
        this.position.set(Manager.width / 2, 0);


        this.changeDirectionCounter = 0;
        this.directionX = 0;
        this.changFireTypeCounter = 0;
        this.fireType = 2;
        this.normalFireType = 1;
        this.radiateFireType = 2;

    }

    update(delta) {

        this.y += this.speed * delta;
        if (this.y > Manager.height / 4) {
            this.y = Manager.height / 4;
            this.randomMove(delta);
        }

        if (Manager.Utils.rectsIntersect({ a: Manager.player.playerSprite, b: this.enemySprite })) {
            this.attack();
        }

        this.randomFire(delta);

        this.bossBullet.update(delta);

    }

    randomMove(delta){
        // random move left or right per 5 seconds
        this.changeDirectionCounter += delta;
        if (this.changeDirectionCounter > 300) {
            this.directionX = Math.random() > 0.5 ? 1 : -1;
            this.changeDirectionCounter = 0;
            console.log("Boss changed direction");
        }
        this.x += this.directionX * this.speed * delta;
        if (this.x < this.enemySprite.width / 2) this.x = this.enemySprite.width / 2;
        if (this.x > Manager.width - this.enemySprite.width / 2) this.x = Manager.width - this.enemySprite.width / 2;
    }


    randomFire(delta) {
        // random fire type per 30 seconds
        this.changFireTypeCounter += delta;
        if (this.changFireTypeCounter > 200) {
            this.fireType = Math.floor(Math.random() * 2) + 1;
            this.bossBullet.cleanShooting();
            this.changFireTypeCounter = 0;
        }
        if (this.fireType == this.normalFireType) {
            this.bossBullet.fire(delta);
        }
        else if (this.fireType == this.radiateFireType) {
            this.bossBullet.radiate(delta);
        }
    }

    attack() {

        if (this.attacking) return;
        this.attacking = true;
        console.log("Boss attacked");
        this.interval = setInterval(() => {
            Manager.player.attacked();
            this.attacking = false;
            clearInterval(this.interval); // Dừng việc giảm health sau một khoảng thời gian 
        }, 500);

    }

    attacked() {
        this.health -= 10;
        this.enemySprite.alpha = 0.7;
        setTimeout(() => {
            this.enemySprite.alpha = 1;
        }, 300);
    }

    kill() {
        Manager.player.point = Manager.player.point + 1;
        this.destroy();
    }


}