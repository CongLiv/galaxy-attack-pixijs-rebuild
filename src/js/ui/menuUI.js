
import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Scene1 } from "../scenes/scene1.js";
import { sound } from "@pixi/sound";
import { Sound } from "@pixi/sound";

export class MenuUI extends PIXI.Container {
    constructor() {
        super();
        this.logo = new PIXI.Sprite(PIXI.Texture.from('menu-logo'));
        this.logo.anchor.set(0.5);
        this.logo.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.logo.zIndex = 1;
        this.counterMoveLogo = 250;
        this.addChild(this.logo);

        this.playButtonBar = new PIXI.Container();

        this.playButton = new PIXI.Sprite(PIXI.Texture.from('menu-button'));
        this.playButton.anchor.set(0.5);
        this.playButton.zIndex = 1;
        this.playButton.interactive = true;


        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 36,
            // fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#878180', '#ffffff' ],
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
        this.playButtonText = new PIXI.Text("Play", this.textStyle);
        this.playButtonText.anchor.set(0.5);
        this.playButtonText.zIndex = 2;
        this.playButtonBar.addChild(this.playButtonText);
        this.playButtonBar.addChild(this.playButton);
        this.playButtonBar.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.playButtonBar.sortChildren();
        this.playButtonBar.zIndex = 1;
        this.playButtonBar.interactive = true;
        this.playButtonBar.cursor = 'pointer';

        this.playButtonBar.on('pointerover', () => {
            this.playButtonText.style.fontSize = 40;
            this.playButtonText.style.fill = ['#60a7b3', '#e4d7bf'];
            this.playButtonBar.scale.set(1.05);
        });

        this.playButtonBar.on('pointerout', () => {

            this.playButtonText.style.fill = ['#878180', '#ffffff'];
            this.playButtonBar.scale.set(1);
        });


        this.playButtonBar.on('pointerdown', () => {
            sound.stop('menusound');
            Manager.changeScene(new Scene1());
            Manager.gameState = Manager.state.playing;
        });

        this.sortChildren();

        sound.play('menusound', { loop: true, volume: 0.1});
        
    }

    update(delta) {

        if (this.counterMoveLogo > 0) this.counterMoveLogo -= delta;
        if (this.counterMoveLogo <= 0) {
            this.addChild(this.playButtonBar);
        }

        if (this.counterMoveLogo <= 30) {
            if (this.logo.position.y < 400) {
                return;
            }
            this.logo.position.y -= 4 * delta;
        }

    }

}