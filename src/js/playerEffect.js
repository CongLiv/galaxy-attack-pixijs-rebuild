
import * as PIXI from 'pixi.js';
import { Manager } from './manager.js';

export class PlayerEffect extends PIXI.Container{

    constructor() {
        super();

        // tạo healing sprite
        
        this.healingTexture = [
            PIXI.Texture.from('healing01'),
            PIXI.Texture.from('healing02'),
            PIXI.Texture.from('healing03'),
            PIXI.Texture.from('healing04'),
            PIXI.Texture.from('healing05'),
            PIXI.Texture.from('healing06'),
            PIXI.Texture.from('healing07'),
            PIXI.Texture.from('healing08'),
            PIXI.Texture.from('healing09'),
            PIXI.Texture.from('healing10'),
            PIXI.Texture.from('healing11'),
            PIXI.Texture.from('healing12'),
            PIXI.Texture.from('healing13'),
            PIXI.Texture.from('healing14'),
            PIXI.Texture.from('healing15')
        ]
        this.healingSprite = new PIXI.AnimatedSprite(this.healingTexture);
        this.healingSprite.zIndex = 3;
        this.healingSprite.anchor.set(0.5);
        this.healingSprite.scale.set(1.5);
        this.healingSprite.visible = false;
        this.healingSprite.animationSpeed = 0.5;
        this.addChild(this.healingSprite);


        this.boostTexture = [
            PIXI.Texture.from('aura01'),
            PIXI.Texture.from('aura02'),
            PIXI.Texture.from('aura03'),
            PIXI.Texture.from('aura04'),
        ]
        this.boostSprite = new PIXI.AnimatedSprite(this.boostTexture);
        this.boostSprite.zIndex = 2;
        this.boostSprite.anchor.set(0.5);
        this.boostSprite.scale.set(1.6);
        this.boostSprite.visible = false;
        this.boostSprite.animationSpeed = 0.5;
        this.addChild(this.boostSprite);
        this.boostSprite.position.set(-10, -40);


        this.zIndex = 2;
        this.sortChildren();
    }

    update(delta){
        this.position.set(Manager.player.x, Manager.player.y);
    }
}