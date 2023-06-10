
import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";

export class MenuUI extends PIXI.Container {
    constructor() {
        super();
        this.logo = new PIXI.Sprite(PIXI.Texture.from('menu-logo'));
        this.logo.anchor.set(0.5);
        this.logo.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.logo.zIndex = 1;
        this.counterMoveLogo = 250;
        this.addChild(this.logo);

        this.playButtonBar = new PIXI.Container();

        this.playButton = new PIXI.Sprite(PIXI.Texture.from('menu-button'));
        this.playButton.anchor.set(0.5);
        this.playButton.zIndex = 1;
        this.playButton.interactive = true;


        this.playButtonText = new PIXI.Text("Play", Manager.generalFont);
        this.playButtonText.anchor.set(0.5);
        this.playButtonText.zIndex = 2;
        this.playButtonBar.addChild(this.playButtonText);
        this.playButtonBar.addChild(this.playButton);
        this.playButtonBar.position.set(Manager.app.screen.width / 2, Manager.app.screen.height / 2);
        this.playButtonBar.sortChildren();
        this.playButtonBar.zIndex = 1;
        this.playButtonBar.interactive = true;
        this.playButtonBar.cursor = 'pointer';

        this.playButtonBar.on('pointerover', () => {
            this.playButtonText.style.fill = ['#2235b3', '#ffffff' ]; 
            this.playButtonText.style.fontSize = 45;
        });

        this.playButtonBar.on('pointerout', () => {
            this.playButtonText.style.fill = ['#878180', '#ffffff' ]; 
            this.playButtonText.style.fontSize = 36;
        });


        this.playButtonBar.on('pointerdown', () => {
            // Manager.changeScene();
        });



        this.sortChildren();
    }

    update(delta) {

        if (this.counterMoveLogo > 0) this.counterMoveLogo -= delta;
        if (this.counterMoveLogo <= 0) {
            this.addChild(this.playButtonBar);
        }

        if (this.counterMoveLogo <= 30) {
            if (this.logo.position.y < 400) {
                return;
            }
            this.logo.position.y -= 4 * delta;
        }

    }

}