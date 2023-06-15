import { sound } from "@pixi/sound";
import { Manager } from "../manager";
import { Boss } from "./boss";
import { Enemy1 } from "./enemy1";
import { Enemy2 } from "./enemy2";

export class Spawner {
    constructor() {

        const spawnInterval = 300;
        this.maxSpawns = 5;
        this.spawns = [];
        setInterval(() => this.spawn(), spawnInterval);
    }

    spawn() {


        if (this.spawns.length < this.maxSpawns && Manager.currentScene.won == false) {

            if (Manager.player.level == 1) {
                const spawn = new Enemy1();
                this.spawns.push(spawn);
            }
            else if (Manager.player.level == 2) {
                //random spawn enemy1 or enemy2
                const random = Math.floor(Math.random() * 2);
                if (random == 0) {
                    const enemy1 = new Enemy1();
                    this.spawns.push(enemy1);
                }
                else {
                    const enemy2 = new Enemy2();
                    this.spawns.push(enemy2);
                }
            }
            else {
                this.maxSpawns = 3;

                //random spawn enemy1 or enemy2
                const random = Math.floor(Math.random() * 2);
                if (random == 0) {
                    const enemy1 = new Enemy1();
                    this.spawns.push(enemy1);
                }
                else {
                    const enemy2 = new Enemy2();
                    this.spawns.push(enemy2);
                }

            }
        }

        if (Manager.player.level == 3 && !this.addBoss) {
            const boss = new Boss();
            sound.stop("playingsound");
            sound.play("bosssound", { loop: true });
            this.spawns.push(boss);
            this.addBoss = true;
        }

        console.log(this.spawns.length)

    }
}