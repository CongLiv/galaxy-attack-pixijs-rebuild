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
        this.laserTexture = PIXI.Texture.from('bosslaser');


        this.fireType = 2;
        this.noneFireType = 0;
        this.normalFireType = 1;
        this.laserFireType = 2;
        this.spreadFireType = 3;    // update later

        this.zIndex = 1;


    }

    fire() {

        this.bulletSpeed = this.initBulletSpeed;
        this.bulletCooldown = this.initBulletCooldown;
        this.maxBullets = 30;
        this.fireType = this.normalFireType;

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
        bullet.position.set(this.boss.x, this.boss.y + 75);


        // sound.play('bulletsound', { loop: false, volume: 0.1 });

        this.lastBulletTime = currentTime;
    }


    laser() {
        this.bulletSpeed = this.initBulletSpeed * 4;
        this.bulletCooldown = 20;
        this.maxBullets = 200;
        this.fireType = this.laserFireType;
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

        const laser = new PIXI.Sprite(this.laserTexture);
        laser.anchor.set(0.5);

        this.bullets.push(laser);

        this.addChild(laser);
        laser.position.set(this.boss.x, this.boss.y + 75);

        this.lastBulletTime = currentTime;
    }


    cleanLaser() {
        Manager.currentScene.removeChild(this);

        // await remove all bullet
        this.bullets.forEach((bullet) => {
            this.removeChild(bullet);
        });
        this.bullets = [];

        Manager.currentScene.addChild(this);

    }


    spread(){

        // update later

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

        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet) => {


                if (this.fireType == this.normalFireType)
                    bullet.y += this.bulletSpeed * delta;

                else if (this.fireType == this.laserFireType) {
                    bullet.y += this.bulletSpeed * delta;
                    bullet.x = this.boss.x;
                }

                else if (this.fireType == this.spreadFireType) {
                    bullet.y += this.bulletSpeed * delta;
                    bullet.x += this.bulletSpeed * delta;
                }

            });
        }


        this.collisionDetection();


    }

    collisionDetection() {
        this.bullets.forEach((bullet, bulletIndex) => {

            if (Manager.Utils.rectsIntersect({ a: bullet, b: Manager.player.playerSprite })) {

                if (this.fireType == this.normalFireType) Manager.player.attacked(10);
                else if (this.fireType == this.laserFireType) Manager.player.attacked(0.05);

                if (this.fireType != this.laserFireType) {
                    this.bullets.splice(bulletIndex, 1);
                    this.removeChild(bullet);
                }

            }

        });
    }



}