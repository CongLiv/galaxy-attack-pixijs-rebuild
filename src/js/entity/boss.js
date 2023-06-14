import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Healing } from "../buffer/healing.js";
import { Boost } from "../buffer/boost.js";
import { BossBullet } from "./bossbullet.js";

export class Boss extends PIXI.Container{

    constructor(){
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
        this.addChild(this.bossBullet);

        this.speed = 1;
        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.attacking = false;
        this.zIndex  = 1;
        this.position.set(Manager.width / 2, 0);

        

    }

    update(delta){
        
        this.y += this.speed * delta;
        if (this.y > Manager.height / 4){
            this.y = Manager.height / 4;
        }

        if (Manager.Utils.rectsIntersect({a: Manager.player.playerSprite, b: this.enemySprite})) {
            this.attack();
        }

        this.bossBullet.update(delta);

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
        this.alpha = 0.7;
        setTimeout(() => {
            this.alpha = 1;
        }, 300);
    }

    kill() {
        Manager.player.point = Manager.player.point + 1;
        this.destroy();
    }

}