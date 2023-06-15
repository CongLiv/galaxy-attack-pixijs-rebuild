import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Menu } from "../scenes/menu.js";
import { sound } from "@pixi/sound";

export class GamePauseUI extends PIXI.Container {

    constructor() { 
        super();

        this.shadowBackground = new PIXI.Graphics();
        this.shadowBackground.beginFill(0x000000, 0.5);
        this.shadowBackground.drawRect(0, 0, Manager.app.screen.width, Manager.app.screen.height);
        this.shadowBackground.endFill();
        this.shadowBackground.zIndex = 0;
        this.shadowBackground.interactive = true;
        this.shadowBackground.on('pointerdown', () => {
            Manager.currentScene.pausing = false;
        });
        this.addChild(this.shadowBackground);


        this.gameResumeBar = new PIXI.Container();
        this.bigTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 36,
            // fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#878180', '#ffffff'],
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

        // Button 1
        this.resumeBottonBar1 = new PIXI.Container();
        this.resumeBotton1 = new PIXI.Sprite(PIXI.Texture.from('button'));
        this.resumeBotton1.anchor.set(0.5);
        this.resumeBotton1.zIndex = 1;
        this.resumeBottonBar1.addChild(this.resumeBotton1);
        this.resumeBottonText1 = new PIXI.Text("Resume", this.bigTextStyle);
        this.resumeBottonText1.anchor.set(0.5);
        this.resumeBottonText1.zIndex = 2;
        this.resumeBottonBar1.interactive = true;
        this.resumeBottonBar1.cursor = 'pointer';
        this.resumeBottonBar1.on('pointerdown', () => {
            Manager.currentScene.pausing = false;
        });

        this.resumeBottonBar1.addChild(this.resumeBottonText1);

        // Button 2
        this.resumeBottonBar2 = new PIXI.Container();
        this.resumeBotton2 = new PIXI.Sprite(PIXI.Texture.from('button'));
        this.resumeBotton2.anchor.set(0.5);
        this.resumeBotton2.zIndex = 1;
        this.resumeBottonBar2.addChild(this.resumeBotton2);
        sound.volumeAll = 1;
        this.resumeBottonText2 = new PIXI.Text("Sound: On", this.bigTextStyle);
        this.resumeBottonText2.anchor.set(0.5);
        this.resumeBottonText2.zIndex = 2;
        this.resumeBottonBar2.interactive = true;
        this.resumeBottonBar2.cursor = 'pointer';
        this.resumeBottonBar2.on('pointerdown', () => {
            if (sound.volumeAll > 0) {
                sound.volumeAll = 0;
                this.resumeBottonText2.text = "Sound: Off";
            } else {
                sound.volumeAll = 1;
                this.resumeBottonText2.text = "Sound: On";
            }
        });
        this.resumeBottonBar2.addChild(this.resumeBottonText2);


        // Button 3
        this.resumeBottonBar3 = new PIXI.Container();
        this.resumeBotton3 = new PIXI.Sprite(PIXI.Texture.from('button'));
        this.resumeBotton3.anchor.set(0.5);
        this.resumeBotton3.zIndex = 1;
        this.resumeBottonBar3.addChild(this.resumeBotton3);
        this.resumeBottonText3 = new PIXI.Text("Quit", this.bigTextStyle);
        this.resumeBottonText3.anchor.set(0.5);
        this.resumeBottonText3.zIndex = 2;
        this.resumeBottonBar3.interactive = true;
        this.resumeBottonBar3.cursor = 'pointer';
        this.resumeBottonBar3.on('pointerdown', () => {
            Manager.changeScene(new Menu());
            Manager.currentScene.pausing = false;
            sound.stopAll();
        });
        this.resumeBottonBar3.addChild(this.resumeBottonText3);

        this.gameResumeBar.addChild(this.resumeBottonBar1);
        this.gameResumeBar.addChild(this.resumeBottonBar2);
        this.gameResumeBar.addChild(this.resumeBottonBar3);
        this.gameResumeBar.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);


        this.resumeBottonBar1.position.set(0, -150);
        this.resumeBottonBar2.position.set(0, -30);
        this.resumeBottonBar3.position.set(0, 90);


        this.gameResumeBar.sortChildren();
        this.gameResumeBar.zIndex = 1;
        this.addChild(this.gameResumeBar);  
        this.zIndex = 100;
        

    }

    update(delta) {

    }
}