import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Healing } from "../buffer/healing.js";
import { Boost } from "../buffer/boost.js";

export class Enemy2 extends PIXI.Container {
    constructor() {
        super();

        const enemyTexture = PIXI.Texture.from('enemy2');
        this.enemySprite = new PIXI.Sprite(enemyTexture);
        this.enemySprite.anchor.set(0.5);
        this.addChild(this.enemySprite);
        this.position.set(this.randomSpawnPoint(), 0);
        this.speed = 4;
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.zIndex = 1;
        this.attacking = false;
        this.velocity = new PIXI.Point(0, 1); // Velocity vector for random movement
        this.changeVelocityCounter = 0; // Counter for changing velocity vector

    }



    attack() {

        if (this.attacking) return;
        this.attacking = true;
        console.log("Enemy2 attacked");
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

        // Update the position based on the velocity vector
        this.x += this.velocity.x * this.speed * delta;
        this.y += this.velocity.y * this.speed * delta;

        // Calculate the angle of the enemy's movement direction
        const angle = Math.atan2(this.velocity.y, this.velocity.x) - 90 * Math.PI / 180;
        this.enemySprite.rotation = angle; // Rotate the sprite based on the angle

        if (this.y > Manager.width * 2 || this.x < 0 - 64 || this.x > Manager.width + 64) {
            this.y = 0;
            this.x = this.randomSpawnPoint();
            this.attacking = false;
            this.velocity.set(0, 1); // Reset velocity when enemy respawns
        }

        if (Manager.Utils.rectsIntersect({ a: Manager.player.playerSprite, b: this.enemySprite })) {
            this.attack();
            return;
        }

        // Random movement
        if (!this.attacking) {
            this.randomMove(delta);
        } 
        
    }

    randomMove(delta){
        this.changeVelocityCounter += delta;
            // Randomly change the velocity vector every 2 seconds
            if (this.changeVelocityCounter > 100) {
                let randomDirection = null;
                if (this.x < Manager.width / 2) {
                    randomDirection = 1;
                }
                else {
                    randomDirection = -1;
                }
                this.velocity.set(Math.random() * randomDirection, 1);
                this.changeVelocityCounter = 0;
            }

            
    }


  

    randomSpawnPoint() {
        let randNum = Math.floor(Math.random() * 4);
        let spawnPointX = 64 + randNum * 128;
        return spawnPointX;
    }

    drop() {
        let buff = null;
        // 10% chance to drop healing or boost
        let randNum = Math.floor(Math.random() * 10);
        if (randNum == 0) {
            let randNum2 = Math.floor(Math.random() * 2);
            if (randNum2 == 0) {
                buff = new Healing();
            }
            else {
                buff = new Boost();
            }

        }
        if (buff == null) return;
        buff.position.set(this.x, this.y);
        Manager.bufferHandle.addChild(buff);
        Manager.bufferHandle.addBuff(buff);
    }
}