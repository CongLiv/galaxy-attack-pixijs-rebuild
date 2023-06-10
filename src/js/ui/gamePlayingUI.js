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




        this.pointBar = new PIXI.Container();
        this.pointBar.position.set(margin, margin);
        this.playerPoint = new PIXI.Text( "Point : " +  Manager.player.point.toString(), Manager.generalFont);
        this.playerPoint.position.set(0, 0);    
        this.pointBar.addChild(this.playerPoint);
        this.pointBar.zIndex = 100;
        this.addChild(this.pointBar);
    }

    update(delta){
        this.healthBar.width = this.healthBar.initalWidth * Manager.player.health / Manager.player.maxHealth;
        this.playerPoint.text = "Point : " + Manager.player.point.toString();
        if (this.health <= 0) {
            this.player.died = true;
        }
    }
}