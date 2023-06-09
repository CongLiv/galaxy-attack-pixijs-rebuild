
export class Spawner{
    constructor( create ){

        const spawnInterval = 500;
        this.maxSpawns = 5;
        this.create = create;
        this.spawns = [];
        setInterval(() => this.spawn(), spawnInterval);
    }

    spawn(){
        // if (Manager.app.gameStartScene == false) return;

        if (this.spawns.length < this.maxSpawns){
            const spawn = this.create();
            this.spawns.push(spawn);
        }
        
    }
}