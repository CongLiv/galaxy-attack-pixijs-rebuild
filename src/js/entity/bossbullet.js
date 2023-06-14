import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";


export class BossBullet extends PIXI.Container {
    constructor(boss) {
        super();
        this.boss = boss;
        this.maxBullets = 30;
        this.initBulletSpeed = 4;
        this.initBulletCooldown = 1000;
        this.bulletSpeed = this.initBulletSpeed;
        this.bulletCooldown = this.initBulletCooldown;
        this.lastBulletTime = 0;
        this.bullets = [];
        this.bulletTexture = PIXI.Texture.from('bossbullet');
 

    }


    fire() {

        // Kiểm tra nếu đạn đã đủ nhiều thì xóa đi
        if (this.bullets.length >= this.maxBullets) {
            let b = this.bullets.shift();
            console.log("bullet removed");
            this.removeChild(b);
            b.destroy();
        }

        this.bullets.forEach((bullet) => this.removeChild(bullet));
        this.bullets = this.bullets.filter(bullet => bullet.y < Manager.height && bullet.x < Manager.width && bullet.x > 0);
        this.bullets.forEach((bullet) => this.addChild(bullet));

        // Cooldown giữa các lần bắn đạn
        const currentTime = Date.now();
        if (currentTime - this.lastBulletTime < this.bulletCooldown) {
            return; // Kiểm tra nếu chưa đủ thời gian giữa các lần bắn đạn
        }

        const bullet = new PIXI.Sprite(this.bulletTexture);
        bullet.anchor.set(0.5);
       
        this.bullets.push(bullet);

        this.addChild(bullet);
        bullet.position.set(this.boss.x, this.boss.y + 50);


        // sound.play('bulletsound', { loop: false, volume: 0.1 });

        this.lastBulletTime = currentTime;
    }



    update(delta) {
        // console.log(this.bullets.length);
        if (Manager.player.died) {
            // remove all bullet
            this.bullets.forEach((bullet) => {
                this.removeChild(bullet);
            });
            return;
        }

        this.fire();
        this.bullets.forEach((bullet) => {
            bullet.y += this.bulletSpeed * delta;

        });

        this.collisionDetection();


    }

    collisionDetection() {
        this.bullets.forEach((bullet, bulletIndex) => {

            if (Manager.Utils.rectsIntersect({ a: bullet, b: Manager.player.playerSprite })) {

                Manager.player.attacked();
                this.bullets.splice(bulletIndex, 1);
                this.removeChild(bullet);

            }

        });
    }



}