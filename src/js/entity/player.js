import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { Sound } from "@pixi/sound";

export class Player extends PIXI.Container {
    constructor() {
        super();
        this.dragTarget = null;

        // Bật tính năng tương tác trên stage
        Manager.app.stage.interactive = true;
        Manager.app.stage.hitArea = Manager.app.screen;

        // Bắt sự kiện pointerup và pointerupoutside
        this.onDragEnd = this.onDragEnd.bind(this);
        Manager.app.stage.on('pointerup', this.onDragEnd);
        Manager.app.stage.on('pointerupoutside', this.onDragEnd);

        const playerSize = 128;

        // Tạo các texture cho player
        this.playerTextures = [
            PIXI.Texture.from('player-player08'),
        ];

        this.playerMoveLeftTextures = [
            // PIXI.Texture.from('player-player07'),
            PIXI.Texture.from('player-player06')
        ];

        this.playerMoveRightTextures = [
            // PIXI.Texture.from('player-player09'),
            PIXI.Texture.from('player-player10')
        ];

        this.playerMoveLeftUpTextures = [
            PIXI.Texture.from('player-player02'),
            // PIXI.Texture.from('player-player01')
        ];

        this.playerMoveRightUpTextures = [
            PIXI.Texture.from('player-player04'),
            // PIXI.Texture.from('player-player05')
        ];

        this.playerMoveLeftDownTextures = [
            PIXI.Texture.from('player-player12'),
            // PIXI.Texture.from('player-player11')

        ];

        this.playerMoveRightDownTextures = [
            PIXI.Texture.from('player-player14'),
            // PIXI.Texture.from('player-player15')
        ];

        this.playerExplosiveTextures = [
            PIXI.Texture.from('player-explosive01'),
            PIXI.Texture.from('player-explosive02'),
            PIXI.Texture.from('player-explosive03'),
            PIXI.Texture.from('player-explosive04'),
            PIXI.Texture.from('player-explosive05'),
            PIXI.Texture.from('player-explosive06'),
            PIXI.Texture.from('player-explosive07'),
        ];

        this.explosionSound = Sound.from('assets/explosionsound.mp3');

        // Tạo sprite cho player

        this.playerSprite = new PIXI.AnimatedSprite(this.playerTextures);
        this.playerSprite.zIndex = 1;
        this.playerSprite.animationSpeed = 0.1;
        this.playerSprite.play();
        this.playerSprite.anchor.set(0.5);
        this.addChild(this.playerSprite);
        this.x = Manager.width / 2;
        this.y = Manager.width / 2 + playerSize * 5;


        // // tạo healing sprite
        
        // // this.healingTexture = [
        // //     PIXI.Texture.from('healing01'),
        // //     PIXI.Texture.from('healing02'),
        // //     PIXI.Texture.from('healing03'),
        // //     PIXI.Texture.from('healing04'),
        // //     PIXI.Texture.from('healing05'),
        // //     PIXI.Texture.from('healing06'),
        // //     PIXI.Texture.from('healing07'),
        // //     PIXI.Texture.from('healing08'),
        // //     PIXI.Texture.from('healing09'),
        // //     PIXI.Texture.from('healing10'),
        // //     PIXI.Texture.from('healing11'),
        // //     PIXI.Texture.from('healing12'),
        // //     PIXI.Texture.from('healing13'),
        // //     PIXI.Texture.from('healing14'),
        // //     PIXI.Texture.from('healing15')
        // // ]
        // // this.healingSprite = new PIXI.AnimatedSprite(this.healingTexture);
        // // this.healingSprite.zIndex = 2;
        // // this.healingSprite.anchor.set(0.5);
        // // // this.healingSprite.scale.set(1.5);
        // // this.healingSprite.visible = false;
        // // this.healingSprite.animationSpeed = 0.5;
        // // this.addChild(this.healingSprite);


        // this.boostTexture = [
        //     PIXI.Texture.from('aura01'),
        //     PIXI.Texture.from('aura02'),
        //     PIXI.Texture.from('aura03'),
        //     PIXI.Texture.from('aura04'),
        // ]
        // this.boostSprite = new PIXI.AnimatedSprite(this.boostTexture);
        // this.boostSprite.zIndex = 2;
        // this.boostSprite.anchor.set(0.5);
        // // this.boostSprite.scale.set(1.6);
        // this.boostSprite.visible = false;
        // this.boostSprite.animationSpeed = 0.5;
        // this.addChild(this.boostSprite);
        // this.boostSprite.position.set(-10, -40);

        // Thuộc tính 
        this.zIndex = 1;
        this.died = false;
        this.point = 0;
        this.level = 1;
        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.boostCounter = 0;


        // this.died = false;
        this.interactive = true;
        this.cursor = 'pointer';

        // Bắt sự kiện pointerdown và pointermove
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.on('pointerdown', this.onDragStart);
        this.on('pointermove', this.onDragMove);

        this.addChild(this.playerSprite);
        this.sortChildren();
        this.lastPosition = this.position.clone();
        this.counterUpdatePosition = 0;

    }

    attacked() {
        this.health -= 10;
        this.alpha = 0.5;

        // code to reverse the alpha of player
        setTimeout(() => {
            this.alpha = 1;
        }, 200);

        if (this.health <= 0) {
            this.died = true;
        }
    }

    kill(){
    
        this.cursor = 'default';
        this.playerSprite.textures = this.playerExplosiveTextures;
        this.playerSprite.loop = false;
        this.playerSprite.play();
        this.explosionSound.play();
        this.playerSprite.onComplete = () => {
            this.playerSprite.stop();
            this.visible = false;
           
        }
    }


    update(delta) {
        
        console.log(this.width, this.height)
        if (this.died && !this.isKilled) {
            this.kill();
            this.explosionSound.play();
            console.log("Player died");
            this.isKilled = true;
        }


        if (this.boostCounter > 0) {
            this.boostCounter -= delta;
            Manager.shooting.bulletCooldown = 100;
        } else {
            Manager.shooting.bulletCooldown = Manager.shooting.initBulletCooldown;
            this.boostCounter = 0;
            Manager.playerEffect.boostSprite.visible = false;
        }


        this.counterUpdatePosition += delta;
        if (this.counterUpdatePosition >= 160) {
            this.lastPosition = this.position.clone();
            this.counterUpdatePosition = 0;
        }

    }

    onDragMove(event) {
        if (this.dragTarget && this.died == false) {
            this.dragTarget.parent.toLocal(event.data.global, null, this.dragTarget.position);

            // change sprite texture while move

            if (this.dragTarget) 
            {
                this.triggerChangeTexture = false;
                const deltaX = this.dragTarget.x - this.lastPosition.x;
                const deltaY = this.dragTarget.y - this.lastPosition.y;

                if (deltaX > 0 && deltaY > 0) {
                    // Drag right-down
                    this.playerSprite.textures = this.playerMoveRightDownTextures;
                } else if (deltaX > 0 && deltaY < 0) {
                    // Drag right-up
                    this.playerSprite.textures = this.playerMoveRightUpTextures;
                } else if (deltaX < 0 && deltaY > 0) {
                    // Drag left-down
                    this.playerSprite.textures = this.playerMoveLeftDownTextures;
                } else if (deltaX < 0 && deltaY < 0) {
                    // Drag left-up
                    this.playerSprite.textures = this.playerMoveLeftUpTextures;
                } else if (deltaX > 0) {
                    // Drag right
                    this.playerSprite.textures = this.playerMoveRightTextures;
                } else if (deltaX < 0) {
                    // Drag left
                    this.playerSprite.textures = this.playerMoveLeftTextures;
                } else if (deltaY > 0) {
                    // Drag down
                    this.playerSprite.textures = this.playerTextures;
                } else if (deltaY < 0) {
                    // Drag up
                    this.playerSprite.textures = this.playerTextures;
                }


                // Chạy animation
                this.playPlayerSprite();

            }
        }
    }


    playPlayerSprite() {

        this.playerSprite.play();
        this.playerSprite.loop = false; // Ngừng lặp lại animation sau khi chạy xong 2 frames
        this.playerSprite.onComplete = () => { // Sự kiện khi hoàn thành animation
            this.playerSprite.stop();
            setTimeout(() => {

                this.playerSprite.textures = this.playerTextures;
            }, 150);
        };
    }

    onDragStart(event) {
        this.dragTarget = event.currentTarget;
        //this.dragTarget.alpha = 0.5;
        Manager.app.stage.on('pointermove', this.onDragMove);
    }

    onDragEnd() {
        if (this.dragTarget) {
            Manager.app.stage.off('pointermove', this.onDragMove);
            this.dragTarget.alpha = 1;
            this.dragTarget = null;
        }
    }


    heal(){
        this.health = this.maxHealth + 10 > this.maxHealth ? this.maxHealth : this.health + 10;
        Manager.playerEffect.healingSprite.visible = true;
        Manager.playerEffect.healingSprite.gotoAndPlay(0);
        Manager.playerEffect.healingSprite.loop = false;
        Manager.playerEffect.healingSprite.onComplete = () => {
            Manager.playerEffect.healingSprite.visible = false;
            Manager.playerEffect.healingSprite.stop();
        }
        
    }

    boost(){    
        this.boostCounter = 200;
        Manager.playerEffect.boostSprite.visible = true;
        Manager.playerEffect.boostSprite.play();
    }

}