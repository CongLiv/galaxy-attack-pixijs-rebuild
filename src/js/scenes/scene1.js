import * as PIXI from "pixi.js";
import { IScene } from "../manager.js";
import { Manager } from "../manager.js";
import { Player } from "../entity/player.js";
import { GamePlayingUI } from "../ui/gamePlayingUI.js";
import { Bullet } from "../entity/bullet.js";
import { Spawner } from "../entity/spawner.js";
import { Enemy1 } from "../entity/enemy1.js";


export class Scene1 extends IScene {

    constructor() {
        super();

        this.background = new PIXI.TilingSprite(
            PIXI.Texture.from('scene1-background'),
            Manager.app.screen.width,
            Manager.app.screen.height
        );
        this.addChild(this.background);

        Manager.player = new Player();
        this.addChild(Manager.player);

        this.gamePlayingUI = new GamePlayingUI();
        this.addChild(this.gamePlayingUI);

        this.enemySpawner = new Spawner(() => new Enemy1());

        Manager.shooting = new Bullet(this.enemySpawner);
        this.addChild(Manager.shooting);

        this.sortableChildren = true;

    }
    update(delta) {

        this.background.tilePosition.y += 1 * delta;

        this.gamePlayingUI.update(delta);
        Manager.player.update(delta);
        Manager.shooting.update(delta);

        this.enemySpawner.spawns.forEach((enemy) => {
            enemy.update(delta);
            this.addChild(enemy);
        });

    }
    


}