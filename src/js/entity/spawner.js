import { Manager } from "../manager";
import { Enemy1 } from "./enemy1";
import { Enemy2 } from "./enemy2";

export class Spawner {
    constructor() {

        const spawnInterval = 500;
        this.maxSpawns = 5;
        this.spawns = [];
        setInterval(() => this.spawn(), spawnInterval);
    }

    spawn() {
        // if (Manager.app.gameStartScene == false) return;

        if (this.spawns.length < this.maxSpawns) {

            if (Manager.player.level == 1) {
                const spawn = new Enemy1();
                this.spawns.push(spawn);
            }
            else if (Manager.player.level == 2)
            {   
                const spawn = new Enemy2();
                this.spawns.push(spawn);
            }
        }

    }
}