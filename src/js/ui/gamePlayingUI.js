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



        this.bigTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 60,
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
        // Level up 
        this.levelUpText = new PIXI.Text("Level up!", this.bigTextStyle);
        this.levelUpText.anchor.set(0.5);
        this.levelUpText.position.set(Manager.width / 2, Manager.height / 2);
        this.levelUpText.visible = false;
        this.addChild(this.levelUpText);

        this.blinkCounter = 1;


        this.bossTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 60,
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
        this.bossText = new PIXI.Text("BOSS", this.bossTextStyle);
        this.bossText.style.fill = ['#cc1616'];
        this.bossText.anchor.set(0.5);
        this.bossText.position.set(Manager.width / 2, Manager.height / 2);
        this.bossText.visible = false;
        this.addChild(this.bossText);

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

        if (this.bossText.visible == true) {
            this.blinkCounter += delta * 0.1;
            this.bossText.alpha = Math.abs(Math.sin(this.blinkCounter));
        }

        if (Manager.player.isLevelUp && Manager.player.level != 3)  {
            // console.log("call to play level up");
            this.playLevelUp();
        }

        else if (Manager.player.isLevelUp && Manager.player.level == 3) {
            this.playBoss();
        }

    }

    playLevelUp() {
        this.levelUpText.visible = true;
        // play sound level up only 1 time
        
        if (Manager.player.isLevelUp && !this.soundPlayed){
            sound.play('levelupsound', {loop: false});
            this.soundPlayed = true;
        }

        setTimeout(() => {
            Manager.player.isLevelUp = false;
            console.log("level up finish");
            this.levelUpText.visible = false;
            this.soundPlayed = false;
        }, 2000);

    }

    playBoss(){
        this.bossText.visible = true;
        // play sound level up only 1 time
        
        setTimeout(() => {
            Manager.player.isLevelUp = false;
            this.bossText.visible = false;
        }, 5000);
    }
}