
import * as PIXI from 'pixi.js';
import { Manager } from './manager.js';

export class Utils{
    constructor() { /*this class is purely static. No constructor to see here*/ }

    rectsIntersect({ a, b }) {

        return (
            a.getGlobalPosition().x - a.width / 2 < b.getGlobalPosition().x + b.width / 2 &&
            a.getGlobalPosition().x  + a.width / 2 > b.getGlobalPosition().x - b.width / 2 &&
            a.getGlobalPosition().y - a.height < b.getGlobalPosition().y + b.height / 2 &&
            a.getGlobalPosition().y + a.width / 2 > b.getGlobalPosition().y - b.height / 2
        );
    }

    
}