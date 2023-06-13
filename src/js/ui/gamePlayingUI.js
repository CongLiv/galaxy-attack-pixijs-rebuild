import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Sound, sound } from "@pixi/sound";

export class GamePlayingUI extends PIXI.Container {

    constructor() {
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



        this.textStyle = new PIXI.TextStyle({
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

        this.pointBar = new PIXI.Container();
        this.pointBar.position.set(Manager.width - margin, margin);
        this.playerPoint = new PIXI.Text("Point : " + Manager.player.point.toString(), this.textStyle);
        this.playerPoint.anchor.set(1, 0);
        this.pointBar.addChild(this.playerPoint);
        this.pointBar.zIndex = 100;
        this.addChild(this.pointBar);



        this.pauseButtonBar = new PIXI.Container();
        this.pauseButton = new PIXI.Sprite(PIXI.Texture.from('pause'));
        this.pauseButton.zIndex = 2;

        this.pauseButtonBar.addChild(this.pauseButton);
        this.pauseButtonBar.interactive = true;
        this.pauseButtonBar.cursor = 'pointer';
        this.pauseButtonBar.on('pointerdown', () => {
            Manager.currentScene.pausing = true;
        });

        this.pauseButtonBar.position.set(margin, margin);

        this.addChild(this.pauseButtonBar);

        this.zIndex = 99;

        // this.bgSound = Sound.from('assets/playingsound.wav');
        // this.bgSound.loop = true;
        // this.bgSound.volume = 0.5;
        // this.bgSound.play();

        sound.play('playingsound', { loop: true, volume: 0.5 })


        // Level up 
        this.levelUpText = new PIXI.Text("Level up!", this.textStyle);
        this.levelUpText.anchor.set(0.5);
        this.levelUpText.position.set(Manager.width / 2, Manager.height / 2);
        this.levelUpText.visible = false;
        this.addChild(this.levelUpText);



    }

    update(delta) {

        this.healthBar.width = this.healthBar.initalWidth * Manager.player.health / Manager.player.maxHealth;
        this.playerPoint.text = "Point : " + Manager.player.point.toString();
        if (this.health <= 0) {
            this.player.died = true;
        }

        if (this.levelUpText.visible == true) {
            this.blinkCounter += delta * 0.1;
            this.levelUpText.alpha = Math.abs(Math.sin(this.blinkCounter));
        }

        if (Manager.player.levelUp) {
            this.playLevelUp();
            
        }

    }

    playLevelUp() {
        this.levelUpText.visible = true;
        setTimeout(() => {
            this.levelUpText.visible = false;
            Manager.player.levelUp = false;
        }, 10000);

    }
}