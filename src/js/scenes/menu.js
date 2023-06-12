import * as PIXI from "pixi.js";
import { IScene } from "../manager.js";
import { Manager } from "../manager.js";
import { MenuUI } from "../ui/menuUI.js";
import { Sound, sound } from "@pixi/sound";
import { Healing } from "../buffer/healing.js";

export class Menu extends IScene {

    constructor() {
        super();
        this.menuBackground = new PIXI.TilingSprite(
            PIXI.Texture.from('menu-menubackground'),
            Manager.app.screen.width,
            Manager.app.screen.height
        );
        this.menuBackground.zIndex = 0;
        this.addChild(this.menuBackground);

        this.menuUI = new MenuUI();
        this.addChild(this.menuUI);
        this.sortChildren();       

    }

    update(delta) {
        
        this.menuUI.update(delta);

    }
}