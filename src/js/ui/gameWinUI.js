import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Menu } from "../scenes/menu.js";
import { sound } from "@pixi/sound";

export class GameWinUI extends PIXI.Container {

    constructor() {
        super();

        this.gameOverBar = new PIXI.Container();

        this.bigTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 50,
            // fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#60a7b3', '#e4d7bf'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });


        this.smallTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 25,
            // fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#60a7b3', '#e4d7bf'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        this.gameOverText = new PIXI.Text("YOU WON!", this.bigTextStyle);

        this.gameOverText.anchor.set(0.5);
        this.gameOverText.zIndex = 2;
        this.gameOverBar.addChild(this.gameOverText);

        this.gameReloadText = new PIXI.Text("Return to menu", this.smallTextStyle);
        this.gameReloadText.anchor.set(0.5);
        this.gameReloadText.zIndex = 2;
        this.gameReloadText.interactive = true;
        this.gameReloadText.cursor = 'pointer';
        this.gameReloadText.position.set(0, 50);
        this.gameOverBar.addChild(this.gameReloadText);

        this.gameOverBar.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);


        this.gameReloadText.on('pointerdown', () => {
            Manager.changeScene(new Menu());
            sound.stopAll();
        });

        this.addChild(this.gameOverBar);
        this.zIndex = 100;

        this.blinkCounter = 1;
    }

    update(delta) {

        this.blinkCounter += delta * 0.1;
        this.gameReloadText.alpha = Math.abs(Math.sin(this.blinkCounter));

    }

    
}

