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

        // Tạo đối tượng player

        this.player = new PIXI.Sprite(PIXI.Texture.from('player-player03'));

        this.player.anchor.set(0.5);
        this.player.x = Manager.width / 2;
        this.player.y = Manager.width / 2 + playerSize * 5;


        // Thuộc tính 
        this.zIndex = 1;
        this.player.died = false;
        this.player.point = 0;
        this.player.level = 1;
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



        this.playerTextures = [
            PIXI.Texture.from('player-player08'),
            PIXI.Texture.from('player-player08'),
        ];

        this.playerMoveLeftTextures = [
            PIXI.Texture.from('player-player07'),
            PIXI.Texture.from('player-player06')
        ];

        this.playerMoveRightTextures = [
            PIXI.Texture.from('player-player09'),
            PIXI.Texture.from('player-player10')
        ];

        this.playerMoveLeftUpTextures = [
            PIXI.Texture.from('player-player02'),
            PIXI.Texture.from('player-player01')
        ];

        this.playerMoveRightUpTextures = [
            PIXI.Texture.from('player-player04'),
            PIXI.Texture.from('player-player05')
        ];

        this.playerMoveLeftDownTextures = [
            PIXI.Texture.from('player-player12'),
            PIXI.Texture.from('player-player11')

        ];

        this.playerMoveRightDownTextures = [
            PIXI.Texture.from('player-player14'),
            PIXI.Texture.from('player-player15')
        ];

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

        if (this.player.point == 20) {
            this.player.level = 3;
        }


    }

    onDragMove(event) {
        if (this.dragTarget) {
            this.dragTarget.parent.toLocal(event.data.global, null, this.dragTarget.position);
        }
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