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

        // Tạo đối tượng player

        this.playerSprite = new PIXI.AnimatedSprite(this.playerTextures);
        this.playerSprite.animationSpeed = 0.1;
        this.playerSprite.play();
        this.playerSprite.anchor.set(0.5);
        this.addChild(this.playerSprite);
        this.x = Manager.width / 2;
        this.y = Manager.width / 2 + playerSize * 5;


        // Thuộc tính 
        this.zIndex = 1;
        this.died = false;
        this.point = 0;
        this.level = 1;
        this.maxHealth = 10;
        this.health = this.maxHealth;


        // this.died = false;
        this.interactive = true;
        this.cursor = 'pointer';

        // Bắt sự kiện pointerdown và pointermove
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.on('pointerdown', this.onDragStart);
        this.on('pointermove', this.onDragMove);

        this.addChild(this.playerSprite);

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
    
        if (this.died && !this.isKilled) {
            this.kill();
            this.explosionSound.play();
            console.log("Player died");
            this.isKilled = true;
        }

        if (this.point == 10) {
            this.level = 2;
        }

        if (this.point == 50) {
            this.level = 3;
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
}