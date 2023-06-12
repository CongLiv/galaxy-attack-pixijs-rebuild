import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { IScene } from "../manager.js";
import { Manager } from "../manager.js";
import { Player } from "../entity/player.js";
import { GamePlayingUI } from "../ui/gamePlayingUI.js";
import { Bullet } from "../entity/bullet.js";
import { Spawner } from "../entity/spawner.js";
import { Enemy1 } from "../entity/enemy1.js";
import { GameOverUI } from "../ui/gameOverUI.js";
import { GamePauseUI } from "../ui/gamePauseUI.js";
import { Healing } from "../buffer/healing.js";
import { BufferHandle } from "../buffer/bufferHandle.js";

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

        this.gameOverUI = new GameOverUI();

        this.enemySpawner = new Spawner(() => new Enemy1());

        Manager.shooting = new Bullet(this.enemySpawner);
        this.addChild(Manager.shooting);

        Manager.bufferHandle = new BufferHandle();


        this.gamePauseUI = new GamePauseUI();
        this.addChild(this.gamePauseUI);
        this.gamePauseUI.visible = false;

        this.sortableChildren = true;


    }


    update(delta) {

        if (this.pausing == false) {
            this.gamePauseUI.visible = false;
            this.background.tilePosition.y += 1 * delta;

            this.gamePlayingUI.update(delta);
            Manager.player.update(delta);
            Manager.shooting.update(delta);
            

            this.enemySpawner.spawns.forEach((enemy) => {
                enemy.update(delta);
                this.addChild(enemy);
            });

            Manager.bufferHandle.buffs.forEach((buff) => {
                buff.update(delta);
                this.addChild(buff);
            });

            if (Manager.player.died && !this.isGameOverAdded) {
                console.log("game over");
                this.addChild(this.gameOverUI);
                this.isGameOverAdded = true;
            }

            if (Manager.player.died) this.gameOverUI.update(delta);

            if (Manager.player.died && !this.removedChild) {
                this.removeChild(this.gamePlayingUI);
                this.removedChild = true;
            }

        }

        else {
            this.gamePauseUI.update(delta);
            this.gamePauseUI.visible = true;
        }

    


    }



}