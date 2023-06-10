import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";

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



        // Tạo đối tượng player

        this.player = new PIXI.AnimatedSprite(this.playerTextures);
        this.player.animationSpeed = 0.1;
        this.player.play();
        this.player.anchor.set(0.5);
        this.player.x = Manager.width / 2;
        this.player.y = Manager.width / 2 + playerSize * 5;


        // Thuộc tính 
        this.zIndex = 1;
        this.died = false;
        this.point = 0;
        this.level = 1;
        this.maxHealth = 100;
        this.health = this.maxHealth;


        // this.died = false;
        this.player.interactive = true;
        this.player.cursor = 'pointer';

        // Bắt sự kiện pointerdown và pointermove
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.player.on('pointerdown', this.onDragStart);
        this.player.on('pointermove', this.onDragMove);

        this.addChild(this.player);

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
    }


    get position() {
        return this.player.position;
    }

    get width() {
        return this.player.width;
    }

    get height() {
        return this.player.height;
    }

    get died() {
        return this.player.died;
    }
    set died(value) {
        this.player.died = value;
    }

    get point() {
        return this.player.point;
    }

    set point(value) {
        this.player.point = value;
    }


    update(delta) {
        if (this.died) return;

        if (this.player.point == 10) {
            this.player.level = 2;
        }

        if (this.player.point == 50) {
            this.player.level = 3;
        }


        this.counterUpdatePosition += delta;
        if (this.counterUpdatePosition >= 160) {
            this.lastPosition = this.player.position.clone();
            this.counterUpdatePosition = 0;
        }

    }

    onDragMove(event) {
        if (this.dragTarget) {
            this.dragTarget.parent.toLocal(event.data.global, null, this.dragTarget.position);

            // change sprite texture while move

            if (this.dragTarget) 
            {
                this.triggerChangeTexture = false;
                const deltaX = this.dragTarget.x - this.lastPosition.x;
                const deltaY = this.dragTarget.y - this.lastPosition.y;

                if (deltaX > 0 && deltaY > 0) {
                    // Drag right-down
                    this.dragTarget.textures = this.playerMoveRightDownTextures;
                } else if (deltaX > 0 && deltaY < 0) {
                    // Drag right-up
                    this.dragTarget.textures = this.playerMoveRightUpTextures;
                } else if (deltaX < 0 && deltaY > 0) {
                    // Drag left-down
                    this.dragTarget.textures = this.playerMoveLeftDownTextures;
                } else if (deltaX < 0 && deltaY < 0) {
                    // Drag left-up
                    this.dragTarget.textures = this.playerMoveLeftUpTextures;
                } else if (deltaX > 0) {
                    // Drag right
                    this.dragTarget.textures = this.playerMoveRightTextures;
                } else if (deltaX < 0) {
                    // Drag left
                    this.dragTarget.textures = this.playerMoveLeftTextures;
                } else if (deltaY > 0) {
                    // Drag down
                    this.dragTarget.textures = this.playerTextures;
                } else if (deltaY < 0) {
                    // Drag up
                    this.dragTarget.textures = this.playerTextures;
                }


                // Chạy animation
                this.playPlayerSprite();

            }
        }
    }


    playPlayerSprite() {

        this.player.play();
        this.player.loop = false; // Ngừng lặp lại animation sau khi chạy xong 2 frames
        this.player.onComplete = () => { // Sự kiện khi hoàn thành animation
            this.player.stop();
            setTimeout(() => {

                this.player.textures = this.playerTextures;
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