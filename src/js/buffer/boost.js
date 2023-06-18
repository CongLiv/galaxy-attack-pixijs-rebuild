import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";
export class Boost extends PIXI.Container {

    constructor() {
        super();
        this.type = 'boost';
        this.boostSprite = new PIXI.Sprite(PIXI.Texture.from('boost'));
        this.boostSprite.anchor.set(0.5);
        this.addChild(this.boostSprite);
        this.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.fallSpeed = 2.5; // Tốc độ rơi
        this.blinkCounter = 1;
        this.used = false;

    }

    update(delta) {

        if (!this.used){
            this.blinkCounter += delta * 0.1;
            this.boostSprite.scale = new PIXI.Point(1 + Math.sin(this.blinkCounter) * 0.1, 1 + Math.sin(this.blinkCounter) * 0.1);
            
    
            // Cập nhật vị trí y của sprite theo tốc độ rơi
            this.y += this.fallSpeed * delta;

            if (Manager.Utils.rectsIntersect({a: Manager.player.playerSprite, b: this})) {
                console.log("Boost");
                Manager.player.boost();
                this.used = true;
               
            }
        }

        if (this.used || (this.boostSprite.y > Manager.app.screen.height)) {
            Manager.bufferHandle.removeChild(this);
            this.destroy();
        }
        
    }


    


}