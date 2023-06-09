import * as PIXI from "pixi.js";
import { IScene } from "../manager.js";
import { Scene1 } from "./scene1.js";
import { Manager } from "../manager.js";
import { manifest } from "../assets.js";
export class LoaderScene extends IScene {

    constructor() {
        super();
        // for making our loader graphics...
        this.loaderBar;
        this.loaderBarBoder;
        this.loaderBarFill;

        const loaderBarWidth = Manager.width * 0.8;

        this.loaderBarFill = new PIXI.Graphics();
        this.loaderBarFill.beginFill(0x008800, 1);
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0;

        this.loaderBarBoder = new PIXI.Graphics();
        this.loaderBarBoder.lineStyle(10, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

        this.loaderBar = new PIXI.Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        this.initializeLoader().then(() => {
            this.gameLoaded();
        })
    }

    async initializeLoader() {
        await PIXI.Assets.init({ manifest: manifest });

        const bundleIds = manifest.bundles.map(bundle => bundle.name);

        await PIXI.Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    downloadProgress(progressRatio) {
        this.loaderBarFill.scale.x = progressRatio;
    }

    gameLoaded() {

        // Change scene to the game scene!
        Manager.changeScene(new Scene1());
    }

    update(delta) {
        // To be a scene we must have the update method even if we don't use it.
    }
}