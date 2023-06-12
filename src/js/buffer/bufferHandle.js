import * as PIXI from "pixi.js";
import { Manager } from "../manager.js";
import { sound } from "@pixi/sound";

export class BufferHandle{
    constructor(){
        this.buffs = [];
    }


    addBuff(buff){
        this.buffs.push(buff);
    }
}