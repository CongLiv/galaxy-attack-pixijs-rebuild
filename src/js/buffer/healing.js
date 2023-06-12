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

    }

    update(delta) {

        this.blinkCounter += delta * 0.1;
        this.healingSprite.scale = new PIXI.Point(1 + Math.sin(this.blinkCounter) * 0.1, 1 + Math.sin(this.blinkCounter) * 0.1);
        

        // Cập nhật vị trí y của sprite theo tốc độ rơi
        this.y += this.fallSpeed * delta;

        // Kiểm tra nếu sprite đã vượt quá đáy màn hình
        if (this.healingSprite.y > Manager.app.screen.height) {
            // Xóa đối tượng healing khỏi scene
            this.destroy();
        }



        if (this.rectsIntersect({a: Manager.player, b: this})) {
            Manager.player.heal();
            this.destroy();
            this.visible = false;
        }
        
    }


    rectsIntersect({ a, b }) {
        // Kiểm tra xem hai hình chữ nhật có giao nhau hay không
        return (
            a.position.x - 64 + a.width > b.position.x - 35 &&
            a.position.x - 64 < b.position.x - 35 + b.width &&
            a.position.y - 64 + a.height > b.position.y - 35 &&
            a.position.y - 64 < b.position.y + b.height - 35
        );
    }
    


}