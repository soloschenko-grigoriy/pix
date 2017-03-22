var Sprite          = window.PIXI.Sprite,
    Loader          = window.PIXI.loader,
    Texture         = window.PIXI.Texture,
    Graphics        = window.PIXI.Graphics,
    Container       = window.PIXI.Container,
    AnimatedSprite  = window.PIXI.extras.AnimatedSprite;

import Bullet from './bullet';

export default class Ship{
    constructor(params){
        this.bodyHp     = params.bodyHp  || 100;
        this.sailHp     = params.sailHp  || 100;
        this.bullets    = params.bullets || 0;
        this.speed      = params.speed   || 1;
        this.damageZone = params.damageZone || 1;

        this._currentBodyHp = params.bodyHp  || 100;

        this.isEnemy = params.isEnemy || false;
        this.isActive = params.isActive || false;
        
        this.stage = params.stage;

        if(params.noAutoRender){
            return;
        }

        this.render(params);
    }


    get bodyHp(){
        return this._bodyHp;
    }

    set bodyHp(value){
        this._bodyHp = value;
    }

    get sailHp(){
        return this._sailHp;
    }

    set sailHp(value){
        this._sailHp = value;
    }

    get bullets(){
        return this._bullets;
    }

    set bullets(value){
        this._bullets = value;
    }

    get speed(){
        return this._speed;
    }

    set speed(value){
        this._speed = value;
    }

    get stage(){
        return this._stage;
    }

    set stage(value){
        this._stage = value;
    }

    get damageZone(){
        return this._damageZone;
    }

    set damageZone(value){
        this._damageZone = value;
    }

    get isEnemy(){
        return this._isEnemy;
    }

    set isEnemy(value){
        this._isEnemy = value;
    }

    render(params){
        this.container = new Container();
        this.container.x = params.x || 300;
        this.container.y = params.y || 300;
        this.container.vx = 0;
        this.container.vy = 0;

        this.isStopping     = false;
        this.isAccelerating = false;

        this.elm     = this.renderMoving();
        this.stopped = this.renderStopped();
        this.hp      = this.renderHP();
        this.dz      = this.renderDamageZone();
        
        
        this.container.addChild(this.hp);
        this.container.addChild(this.dz);
        this.container.addChild(this.stopped);
        this.container.addChild(this.elm);
        this.container.addChild(this.renderCollidePoints());
        // console.log(this.elm.calculateVertices());
        // console.log(this.elm.filterArea);
        this.addInputListeners();

        this.stage.addChild(this.container);
        
        requestAnimationFrame(this.update.bind(this));
        this.elm.interactive = true;
        this.elm.on('click', (e) =>{
            var position = e.data.getLocalPosition(this.stage);
            // console.log(this.container.position.x, this.container.position.y);
            console.log(position.x - this.container.x, position.y - this.container.y);
        });
    }

    renderStopped(){
        let sprite = new Sprite(Loader.resources["assets/img/ship0-stop.png"].texture);
        sprite.anchor.set(0.5, 0.55);
        sprite.scale.set(0.3);
        sprite.rotation = -Math.PI/3;
        sprite.visible = false;

        return sprite;
    }

    renderMoving(){
        let frames = [];
        for (let i = 1; i < 15; i++) {
            frames.push(Texture.fromFrame(i + '.png'));
        }

        let sprite = new AnimatedSprite(frames);
        sprite.anchor.set(0.5, 0.55);
        sprite.scale.set(0.3);
        sprite.gotoAndStop(7);
        sprite.rotation = -Math.PI/3;
        sprite.animationSpeed = 0.2;
        sprite.visible = true;

        var x = new Graphics();
        x.beginFill(0xffffff);
        x.drawRect();
        x.endFill();

        return sprite;
    }

    renderCollidePoints(){
        var dz = new Container();
        
        var cpC = new Graphics();
        cpC.beginFill(0x000000);
        cpC.drawCircle(this.elm.x, this.elm.y, 1);
        cpC.endFill();
        dz.addChild(cpC);

        var cp1 = new Graphics();
        cp1.beginFill(0x000000);
        cp1.drawCircle(this.elm.x - 22, this.elm.y - 13, 1);
        cp1.endFill();
        dz.addChild(cp1);

        var cp2 = new Graphics();
        cp2.beginFill(0x000000);
        cp2.drawCircle(this.elm.x + 23, this.elm.y + 12, 1);
        cp2.endFill();
        dz.addChild(cp2);

        var cp3 = new Graphics();
        cp3.beginFill(0x000000);
        cp3.drawCircle(this.elm.x - 5, this.elm.y + 8, 1);
        cp3.endFill();
        dz.addChild(cp3);

        var cp4 = new Graphics();
        cp4.beginFill(0x000000);
        cp4.drawCircle(this.elm.x + 5, this.elm.y - 9, 1);
        cp4.endFill();
        dz.addChild(cp4);

        var cp5 = new Graphics();
        cp5.beginFill(0x000000);
        cp5.drawCircle(this.elm.x - 15, this.elm.y, 1);
        cp5.endFill();
        dz.addChild(cp5);

        var cp6 = new Graphics();
        cp6.beginFill(0x000000);
        cp6.drawCircle(this.elm.x - 8, this.elm.y - 14, 1);
        cp6.endFill();
        dz.addChild(cp6);

        var cp7 = new Graphics();
        cp7.beginFill(0x000000);
        cp7.drawCircle(this.elm.x + 8, this.elm.y + 12, 1);
        cp7.endFill();
        dz.addChild(cp7);

        var cp8 = new Graphics();
        cp8.beginFill(0x000000);
        cp8.drawCircle(this.elm.x + 15, this.elm.y, 1);
        cp8.endFill();
        dz.addChild(cp8);

        return dz;
    }

    renderHP(){
        var hp = this.hp || new Graphics();
        var w = 80;
        var h = 5;
        
        hp.clear();

        hp.beginFill(0xffffff);
        hp.drawRect(this.elm.x - w/2, this.elm.y - 50, w, h);
        hp.endFill();

        hp.beginFill(0xe74c3c);
        hp.drawRect(this.elm.x - w/2, this.elm.y - 50, w * this._currentBodyHp / 100, h);
        hp.endFill();

        return hp;
    }

    renderDamageZone(){
        var dz = new Container();
        var graphics = new Graphics();
        var lineColor = 0x00ff00;

        if(this.isEnemy){
            lineColor = 0xff0000;
        }
        graphics.beginFill(0xe74c3c, 0.3);
        graphics.lineStyle(2, lineColor, 0.5);
        graphics.drawCircle(this.elm.x, this.elm.y, 100 * this.damageZone);
        graphics.endFill();
        
        
        dz.visible = true;
        dz.addChild(graphics);

        return dz;
    }
    

    showDmageZone(){
        this.dz.visible = true;

        return this;
    }

    hideDmageZone(){
        this.dz.visible = false;

        return this;
    }

    addInputListeners(){
        if(!this.isActive){
            return this;
        }
        document.addEventListener('keydown', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if(e.keyCode === 37){ // left 
                this.rotate('left');
                // bg.vx = 1;
            }else if(e.keyCode === 38){ // up  
                // bg.y += 1;
                this.rotate('up');
                // bg.vx = 1;
            }else if(e.keyCode === 39){ // right
                this.rotate('right');
                // bg.vx = -1;
            }else if(e.keyCode === 40){ // down
                this.rotate('down');
                // bg.vy = -1;
            }else if(e.keyCode === 32){ // down
                this.shoot();
                // bg.vy = -1;

            }
        }); 
    }

    rotate(direction){
        if(direction == 'left'){
            return this._rotateLeft();
        }

        if(direction == 'right'){
            return this._rotateRight();
        }

        if(direction == 'up'){
            return this._rotateUp();
        }

        if(direction == 'down'){
            return this._rotateDown();
        }
        
    }

    _rotateLeft(){
        this.elm.rotation -= 0.05;  
    }

    _rotateRight(){
        this.elm.rotation += 0.05;
        
    }

    _rotateUp(){
        if(this.isAccelerating){ return;}
        this.isStopping = false;          
        this.isAccelerating = true;
        this.vx = 1;
        this.vy = 1;
    }

    _rotateDown(){
        if(this.isStopping){return;}
        this.isAccelerating = false;
        this.isStopping = true;
    }

    destroy(){

    }

    shoot(){
        new Bullet({
            stage: this.stage,
            x: this.container.x,
            y: this.container.y,
            endX: 100,
            endY: 100
        });
    }

    update(){
        if(this.isStopping){
            this.container.vx -= 0.03;
            this.container.vy -= 0.03;
        }
        
        if(this.isAccelerating){
            if(this.container.vx < 2){
                this.container.vx += 0.01;
            }

            if(this.container.vy < 2){
                this.container.vy += 0.01;
            }
        }

        if((this.container.vx < 0 || this.container.vy < 0) && this.isStopping){
            this.container.vx = 0;
            this.container.vy = 0;
            this.elm.gotoAndStop(7);
            this.isStopping = false;
            // this.elm.visible = false;
            this.stopped.x = this.elm.x;
            this.stopped.y = this.elm.y;
            this.stopped.rotation = this.elm.rotation;
            // this.stopped.visible = true;        
        }else if(!this.playing && this.isAccelerating){
            this.elm.visible = true;
            this.stopped.visible = false; 
            this.elm.play();
        }
        
        this.stopped.rotation = this.elm.rotation;
        this.container.x = this.container.x + this.container.vx * Math.sin(this.elm.rotation);
        this.container.y = this.container.y - this.container.vy * Math.cos(this.elm.rotation);
        
        if(this.bodyHp !== this._currentBodyHp){ // hp been changed
            if(this.bodyHp < this._currentBodyHp){
                this._currentBodyHp = this._currentBodyHp - 1;
            }else{
                this._currentBodyHp = this._currentBodyHp + 1;
            }
            
            this.renderHP();
        }
        
        // if(this.anim.x > app.view.width - this.anim.width + 100|| this.anim.x < this.anim.width - 100){
        //     this.anim.vx = 0;
        // }

        // if(this.anim.y > app.view.height - 100 || this.anim.y <  100){
        //     this.anim.vy = 0;
        // }
        // if(bg.position.y > -936 && bg.position.y < 0){
        //     bg.y += bg.vy;
        // }

        // if(bg.position.x > -1248 && bg.position.x < 0){
        //     bg.x += bg.vx;
        // }

        // Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r
        requestAnimationFrame(this.update.bind(this));
    }
}

// GAME.CollisionManager.prototype.playerVsPickup = function(){		
//     var pickups = this.engine.pickupManager.pickups;	
//     var steve = this.engine.steve; // yes, he is called steve 		
//     for (var i = 0; i < pickups.length; i++) 	{		
//         var pickup = pickups[i];		
//         var xdist = pickup.position.x - steve.position.x;		
//         if(xdist > -pickup.width/2 && xdist < pickup.width/2){			
//             var ydist = pickup.position.y - steve.position.y;					
//             if(ydist > -pickup.height/2 && ydist < pickup.height/2){ // HIT CODE!!   			
//             }		
//         }	
//     }
// };