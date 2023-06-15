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
import { Enemy2 } from "../entity/enemy2.js";
import { GameWinUI } from "../ui/gameWinUI.js";

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

        this.enemySpawner = new Spawner();
   

        Manager.shooting = new Bullet(this.enemySpawner);
        this.addChild(Manager.shooting);

        Manager.bufferHandle = new BufferHandle();
        this.addChild(Manager.bufferHandle);

        this.gamePauseUI = new GamePauseUI();
        this.addChild(this.gamePauseUI);
        this.gamePauseUI.visible = false;
    
        this.sortableChildren = true;


        this.gameWinUI = new GameWinUI();
        this.won = false;
    }


    update(delta) {

        if (this.pausing == false) {
            this.gamePauseUI.visible = false;
            this.background.tilePosition.y += 1 * delta;

            this.gamePlayingUI.update(delta);
            if (Manager.player.isKilled == false && this.won == false) Manager.player.update(delta);
            Manager.shooting.update(delta);
            Manager.bufferHandle.update(delta);

            this.enemySpawner.spawns.forEach((enemy) => {
                enemy.update(delta);
                this.addChild(enemy);
            });

            if (Manager.player.died && !this.isGameOverAdded) {
                // console.log("game over");
                this.addChild(this.gameOverUI);
                this.isGameOverAdded = true;
            }

            if (this.won && !this.isGameWinAdded){
                this.addChild(this.gameWinUI);
                sound.stop("bosssound");
                sound.play("playingsound", {loop: true, volume: 0.5});
                this.isGameWinAdded = true;
                this.removeChild(this.gamePlayingUI);
            }

            if (Manager.player.died) this.gameOverUI.update(delta);
            if (this.won) this.gameWinUI.update(delta);
            
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