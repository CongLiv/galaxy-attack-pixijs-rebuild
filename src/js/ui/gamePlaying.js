import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";

export class GamePlayingUI extends PIXI.Container{

    constructor(){
        super();
        const margin = 16;
        const barHeight = 16;

        this.healthBar = new PIXI.Graphics();
        this.healthBar.beginFill('red');
        this.healthBar.initalWidth = Manager.app.screen.width - margin * 2;
        this.healthBar.drawRect(margin, Manager.app.screen.height - barHeight - margin / 2, this.healthBar.initalWidth, barHeight);
        this.healthBar.endFill();
        this.zIndex = 100;
        this.addChild(this.healthBar);
    }

    update(delta){
        this.healthBar.width = this.healthBar.initalWidth * Manager.player.health / Manager.player.maxHealth;
        if (this.health <= 0) {
            this.player.died = true;
        }
    }
}