var _  = window._;

export default class AI{
    get stage(){
        return this._stage;
    }

    set stage(value){
        this._stage = value;
    }

    constructor(params){
        this.stage = params.stage;
        // for(var i in params.ships){
        //     let ship = params.ships[i];
        //     if(!ship.isActive){
        //         this.ships[ship.id] = ship;
        //     }
        // }
    }

    start(){
        for(var i in this.stage.ships){
            let ship = this.stage.ships[i];
            if(ship.isActive){
                continue;
            }
            this.randomlyRotateInactive(ship);
            this.moveRandomly(ship);
        }

        requestAnimationFrame(this.update.bind(this));
        
    }

    moveRandomly(ship){
        ship.isAccelerating = true;
        ship.vx = 0.1;
        ship.vy = 0.1;
    }

    analyzeEnemies(ship){
        if(!ship.isAccelerating){
            return this;
        }

        if(_.size(ship.toAttack) > 0){
            ship.rotateDown();
            _.delay(function(){
                ship.shoot();
            }, 1000);
        }else{
            ship.rotateUp();
        }
    }

    randomlyRotateInactive(ship){
        var num = Math.floor(Math.random() * (100000 - 0 + 1));
        if(num  % 100 === 0){
            ship.rotateLeft();
        }else if(num  % 200 === 0){
            ship.rotateRight();
        }

        return ship;
    }

    update(){
        for(var i in this.stage.ships){
            let ship = this.stage.ships[i];

            if(ship.isActive){
                continue;
            }
            
            this.randomlyRotateInactive(ship);
            this.analyzeEnemies(ship);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}