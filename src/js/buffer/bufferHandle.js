import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";

export class BufferHandle extends PIXI.Container{
    constructor(){
        super();
        this.buffs = [];
    }



    addBuff(buff){
        this.buffs.push(buff);
    }

    update(delta){
        this.buffs.forEach(buff => {
            buff.update(delta);
        });
    }
    
}