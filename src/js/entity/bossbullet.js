import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";


export class BossBullet extends PIXI.Container {
    constructor(boss) {
        super();
        this.boss = boss;
        this.maxBullets = 30;
        this.initBulletSpeed = 20;
        this.initBulletCooldown = 250;
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
            this.removeChild(b);
            b.destroy();
        }

        this.bullets.forEach((bullet) => this.removeChild(bullet));
        this.bullets = this.bullets.filter(bullet => this.y < Manager.height && this.x < Manager.width && this.x > 0);
        this.bullets.forEach((bullet) => this.addChild(bullet));

        // Cooldown giữa các lần bắn đạn
        const currentTime = Date.now();
        if (currentTime - this.lastBulletTime < this.bulletCooldown) {
            return; // Kiểm tra nếu chưa đủ thời gian giữa các lần bắn đạn
        }

        const bullet = new PIXI.Sprite(this.bulletTexture);
        bullet.position.set(this.boss.x + 32, this.boss.y + 96);
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
                bullet.position.y + this.bulletSpeed * delta
            );
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