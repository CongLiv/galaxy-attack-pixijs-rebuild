import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";


export class Bullet extends PIXI.Container {
    constructor(spawner) {
        super();
        this.spawner = spawner;
        this.maxBullets = 30;
        this.initBulletSpeed = 20;
        this.initBulletCooldown = 250;
        this.bulletSpeed = this.initBulletSpeed;
        this.bulletCooldown = this.initBulletCooldown;
        this.lastBulletTime = 0;
        this.bullets = [];
        this.bulletTexture = PIXI.Texture.from('bullet');

    }


    fire() {

        // Kiểm tra nếu đạn đã đủ nhiều thì xóa đi
        if (this.bullets.length >= this.maxBullets) {
            let b = this.bullets.shift();
            b.visible = false;
            this.removeChild(b);
            b.destroy();
        }

        this.bullets.forEach((bullet) => this.removeChild(bullet));
        this.bullets = this.bullets.filter(bullet => bullet.position.y > 0);
        this.bullets.forEach((bullet) => this.addChild(bullet));

        // Cooldown giữa các lần bắn đạn
        const currentTime = Date.now();
        if (currentTime - this.lastBulletTime < this.bulletCooldown) {
            return; // Kiểm tra nếu chưa đủ thời gian giữa các lần bắn đạn
        }

        const bullet = new PIXI.Sprite(this.bulletTexture);
        bullet.anchor.set(0.5);
        bullet.position.set(Manager.player.x, Manager.player.y - 50);
        this.bullets.push(bullet);
        this.addChild(bullet);

        sound.play('bulletsound', { loop: false, volume: 0.1 });

        this.lastBulletTime = currentTime;
    }



    update(delta) {


        if (Manager.player.died) {
            // remove all bullet
            this.bullets.forEach((bullet) => {
                this.removeChild(bullet);
            });
            return;
        }
        this.fire();
        this.bullets.forEach((bullet) => {
            bullet.position.set(
                bullet.position.x,
                bullet.position.y - this.bulletSpeed * delta
            );
        });

        this.collisionDetection();


    }

    collisionDetection() {



        let indexBulletNeedRemove = [];

        this.bullets.forEach((bullet, bulletIndex) => {
            this.spawner.spawns.forEach((enemy, enemyIndex) => {
                if (Manager.Utils.rectsIntersect({ a: bullet, b: enemy.enemySprite })) {

                    indexBulletNeedRemove.push(bulletIndex);
                    enemy.attacked();
                    if (enemy.health <= 0) {
                        this.spawner.spawns.splice(enemyIndex, 1);
                        enemy.kill();
                    }

                }
            });
        });

        // indexBulletNeedRemove.forEach((index) => {
        //     let b = this.bullets[index];
        //     b.visible = false;
        //     this.removeChild(b);
        //     b.destroy();
            
        // });

        // removechild then destroy
        indexBulletNeedRemove.forEach((index) => {
            let b = this.bullets[index];
            this.removeChild(b);
            this.bullets.splice(index, 1);
            //b.visible = false;
            //b.destroy();
        });



        
    }
    

}