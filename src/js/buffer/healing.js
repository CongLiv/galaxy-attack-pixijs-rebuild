import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";
export class Healing extends PIXI.Container {

    constructor() {
        super();
        this.type = 'healing';
        this.healingSprite = new PIXI.Sprite(PIXI.Texture.from('healing'));
        this.healingSprite.anchor.set(0.5);
        this.addChild(this.healingSprite);
        this.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.fallSpeed = 2.5; // Tốc độ rơi
        this.blinkCounter = 1;
        this.used = false;

    }

    update(delta) {

        if (!this.used){
            this.blinkCounter += delta * 0.1;
            this.healingSprite.scale = new PIXI.Point(1 + Math.sin(this.blinkCounter) * 0.1, 1 + Math.sin(this.blinkCounter) * 0.1);
            
    
            // Cập nhật vị trí y của sprite theo tốc độ rơi
            this.y += this.fallSpeed * delta;

            if (Manager.Utils.rectsIntersect({a: Manager.player.playerSprite, b: this})) {
                console.log("Healing");
                Manager.player.heal();
                this.used = true;
               
            }
        }

        if (this.used || (this.healingSprite.y > Manager.app.screen.height)) {
            Manager.bufferHandle.removeChild(this);
            this.destroy();
        }
        
    }

    


}