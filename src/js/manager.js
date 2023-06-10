import * as PIXI from "pixi.js";

export class Manager {

    constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    static app;
    static currentScene;

    // Width and Height are read-only after creation (for now)
    static width;
    static height;

    // player and shooting are read-only after creation (for now)
    static player;
    static shooting;


    // state of the game
    static state = {
        menu: 0,
        playing: 1,
        pause: 2,
        gameOver: 3,
    }

    static gameState = Manager.state.menu;


    // With getters but not setters, these variables become read-only
    static get width() {
        return Manager.width;
    }


    static get height() {
        return Manager.height;
    }


    static get generalFont() {
        return Manager.generalFont;
    }

    // Use this function ONCE to start the entire machinery
    static initialize(width, height, background) {

        // store our width and height
        Manager.width = width;
        Manager.height = height;

        // Create our pixi app
        Manager.app = new PIXI.Application({
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            width: width,
            height: height,
            backgroundColor: 'black',
            
        });

        // Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(Manager.app.view);


        // Add the ticker
        Manager.app.ticker.add(delta => Manager.update(delta));

        // listen for the browser telling us that the screen size changed
        window.addEventListener("resize", Manager.resize);

        // call it manually once so we are sure we are the correct size after starting
        Manager.resize();
    }

    // Call this function when you want to go to a new scene
    static changeScene(newScene) {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    static update(delta) {
        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (Manager.currentScene) {
            Manager.currentScene.update(delta);
        }

    }


    static resize() {
        // current screen size
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // uniform scale for our game
        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

        // the "uniformly englarged" size for our game
        const enlargedWidth = Math.floor(scale * Manager.width);
        const enlargedHeight = Math.floor(scale * Manager.height);

        // margins for centering our game
        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;

        // now we use css trickery to set the sizes and margins
        Manager.app.view.style.width = `${enlargedWidth}px`;
        Manager.app.view.style.height = `${enlargedHeight}px`;
        Manager.app.view.style.marginLeft = Manager.app.view.style.marginRight = `${horizontalMargin}px`;
        Manager.app.view.style.marginTop = Manager.app.view.style.marginBottom = `${verticalMargin}px`;
    }

}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export class IScene extends PIXI.Container {

    update(delta) {

    }
}

