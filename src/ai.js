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
    }

    start(){
        for(var i in this.stage.ships){
            let ship = this.stage.ships[i];
            if(ship.isActive){
                continue;
            }
            // this.randomlyRotateInactive(ship);
            this.moveRandomly(ship);
        }
        // ship.elm.rotation = 0;
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
        ship.rotateDown();
        if(_.size(ship.toAttack) > 0){
            ship.rotateDown();
            ship.shoot();
        }else if(_.size(ship.nearbyShips) > 0){
            this.followActiveShip(ship);
            ship.rotateUp();
        }else{
            ship.rotateUp();
        }
    }

    followActiveShip(ship){
        var active = _.find(ship.nearbyShips, function(enemy){
            return enemy.isActive;
        });

        if(!active){
            return this;
        }
        
        let toRotate = true;
        if(ship.bodyHp > 50){
            for(let i in ship.aimShips){
                if(ship.aimShips[i] === active){
                    toRotate = false;
                    break;
                }
            }
            if(toRotate){
                ship.rotateLeft();
            }
        }else{
            for(let i in ship.backAimShips){
                if(ship.backAimShips[i] === active){
                    toRotate = false;
                    break;
                }
            }
            if(toRotate){
                ship.rotateLeft();
            }
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
            
            // this.randomlyRotateInactive(ship);
            this.analyzeEnemies(ship);
        }

        requestAnimationFrame(this.update.bind(this));
    }
}