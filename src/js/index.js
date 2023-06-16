import { Manager } from './manager.js';
import { LoaderScene } from './scenes/loaderScene.js';

window.onload = () => {
    Manager.initialize(512, 512 * 2, 0x6495ed);

    // We no longer need to tell the scene the size because we can ask Manager!
    const loady = new LoaderScene();

    Manager.changeScene(loady);
};
