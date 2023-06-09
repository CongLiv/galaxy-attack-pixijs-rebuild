import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";


export class Bullet extends PIXI.Container {
    constructor(spawner) {
        super();
        this.spawner = spawner;
        this.maxBullets = 20;
        this.initBulletSpeed = 20;
        this.initBulletCooldown = 250;
        this.bulletSpeed = this.initBulletSpeed;
        this.bulletCooldown = this.initBulletCooldown;
        this.lastBulletTime = 0;
        this.bullets = [];
    }


    fire() {

        // Kiểm tra nếu đạn đã đủ nhiều thì xóa đi
        if (this.bullets.length >= this.maxBullets) {
            let b = this.bullets.shift();
            this.removeChild(b);
        }

        this.bullets.forEach((bullet) => this.removeChild(bullet));
        this.bullets = this.bullets.filter(bullet => Math.abs(bullet.position.y - Manager.player.y) < 512 * 2);
        this.bullets.forEach((bullet) => this.addChild(bullet));

        // Cooldown giữa các lần bắn đạn
        const currentTime = Date.now();
        if (currentTime - this.lastBulletTime < this.bulletCooldown) {
            return; // Kiểm tra nếu chưa đủ thời gian giữa các lần bắn đạn
        }

        const bulletTexture = PIXI.Texture.from('bullet');
        const bullet = new PIXI.Sprite(bulletTexture);
        bullet.position.set(Manager.player.x - 32, Manager.player.y - 96);
        this.bullets.push(bullet);
        this.addChild(bullet);

        this.lastBulletTime = currentTime;
    }



    update(delta) {
        this.fire()
        this.bullets.forEach((bullet) => {
            bullet.position.set(
                bullet.position.x,
                bullet.position.y - this.bulletSpeed * delta
            );
        });

        this.collisionDetection();
        console.log(this.children.length);

    }

    collisionDetection() {
        this.bullets.forEach((bullet, bulletIndex) => {
            this.spawner.spawns.forEach((enemy, enemyIndex) => {
                if (this.rectsIntersect({ a: bullet, b: enemy })) {

                    enemy.attacked();

                    if (enemy.health <= 0) {
                        this.spawner.spawns.splice(enemyIndex, 1);
                        enemy.kill();
                    }

                    this.bullets.splice(bulletIndex, 1);
                    this.removeChild(bullet);
                    console.log("Point: " + Manager.player.point);

                    
                }
            });
        });
    }

    rectsIntersect({ a, b }) {
        // Kiểm tra xem hai hình chữ nhật có giao nhau hay không
        return (
            a.position.x + a.width > b.position.x - 50 &&
            a.position.x < b.position.x - 50 + b.width &&
            a.position.y + a.height > b.position.y - 50 &&
            a.position.y < b.position.y + b.height - 50
        );
    }


}