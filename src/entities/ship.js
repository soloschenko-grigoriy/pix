var _               = window._,
    Sprite          = window.PIXI.Sprite,
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
        this.damageZone = params.damageZone || 100;
        this.observableZone = params.observableZone || 300;
        
        this.app = params.app;

        this.id = params.id; // @todo

        this._currentBodyHp = params.bodyHp  || 100;

        this.isEnemy = params.isEnemy || false;
        this.isActive = params.isActive || false;
        
        this.stage = params.stage;

        this.container = new Container();
        this.container.x = params.x || 300;
        this.container.y = params.y || 300;
        this.container.vx = 0;
        this.container.vy = 0;

        this.stageHeight = this.stage.height;
        this.stageWidth = this.stage.width;
        
        this.toAttack = {};
        this.nearbyShips = {};
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

    get toAttack(){
        return this._toAttack;
    }

    set toAttack(value){
        this._toAttack = value;
    }

    get nearbyShips(){
        return this._nearbyShips;
    }

    set nearbyShips(value){
        this._nearbyShips = value;
    }

    render(){
        this.isStopping     = false;
        this.isAccelerating = false;

        this.elm     = this.renderMoving();
        this.stopped = this.renderStopped();
        this.hp      = this.renderHP();
        this.dz      = this.renderDamageZone();
        this.oz      = this.renderObservableZone();
        this.collidePoints = this.renderCollidePoints();
        this.aim     = this.renderAim();
        this.backAim = this.renderBackAim();
        
        this.container.addChild(this.hp);
        this.container.addChild(this.dz);
        this.container.addChild(this.oz);
        this.container.addChild(this.stopped);
        this.container.addChild(this.elm);
        this.container.addChild(this.collidePoints);
        this.container.addChild(this.aim);
        this.container.addChild(this.backAim);

        this.addInputListeners();
        this.stage.addChild(this.container);
         
        requestAnimationFrame(this.update.bind(this));

        return this;
    }

    renderStopped(){
        let sprite = new Sprite(Loader.resources["assets/img/ship0-stop.png"].texture);
        sprite.anchor.set(0.5, 0.55);
        sprite.scale.set(0.3);
        // sprite.rotation = -Math.PI/3;
        sprite.visible = true;
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
        // sprite.rotation = -Math.PI/3;
        sprite.animationSpeed = 0.2;
        sprite.visible = false;

        var x = new Graphics();
        x.beginFill(0xffffff);
        x.drawRect();
        x.endFill();

        return sprite;
    }

    renderCollidePoints(){
        var container = new Container();
        this.cps = [{
            x: - 22, 
            y: - 13
        },{
            x: + 23, 
            y: + 12
        },{
            x: - 5, 
            y: + 8
        },{
            x: + 5, 
            y: - 9
        },{
            x: - 15, 
            y: 0
        },{
            x: - 8, 
            y: - 14
        },{
            x: + 8, 
            y: + 12
        },{
            x: + 15, 
            y: 0
        }];

        for(let i in this.cps){
            let cp = new Graphics();
            // cp.beginFill(0x000000);
            cp.drawCircle(this.elm.x + this.cps[i].x, this.elm.y + this.cps[i].y, 1);
            // cp.endFill();
            container.addChild(cp);
        }
        return container;
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
        var graphics = new Graphics();
        var lineColor = 0x00ff00;

        if(this.isEnemy){
            lineColor = 0xff0000;
        }
        graphics.beginFill(0xe74c3c, 0.3);
        graphics.lineStyle(2, lineColor, 0.5);
        graphics.drawCircle(this.elm.x, this.elm.y, this.damageZone);
        graphics.endFill();

        return graphics;
    }

    renderObservableZone(){
        var graphics = new Graphics();
        // var lineColor = 0x000000;

        // graphics.lineStyle(2, lineColor, 0.5);
        graphics.drawCircle(this.elm.x, this.elm.y, this.observableZone);
        graphics.endFill();

        return graphics;
    }
    
    renderAim(){
        var graphics = new Graphics();

        // graphics.beginFill(0xff0000, 0.1);
        // graphics.lineStyle(2, 0x00ff00);
        graphics.moveTo(0,0);
        graphics.arc(0, 0, this.observableZone, -2 * Math.PI/3, -Math.PI/3);
        graphics.lineTo(0, 0);
        graphics.endFill();
        

        return graphics;
    }

    renderBackAim(){
        var graphics = new Graphics();

        // graphics.beginFill(0xff0000, .1);
        // graphics.lineStyle(2, 0x00ff00);
        graphics.moveTo(0,0);
        graphics.arc(0, 0, this.observableZone, Math.PI/3, -4 * Math.PI/3);
        graphics.lineTo(0, 0);
        graphics.endFill();
        

        return graphics;
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
                this.rotateLeft();
                // bg.vx = 1;
            }else if(e.keyCode === 38){ // up  
                // bg.y += 1;
                this.rotateUp();
                // bg.vx = 1;
            }else if(e.keyCode === 39){ // right
                this.rotateRight();
                // bg.vx = -1;
            }else if(e.keyCode === 40){ // down
                this.rotateDown();
                // bg.vy = -1;
            }else if(e.keyCode === 32){ // down
                this.shoot();
                // bg.vy = -1;

            }
        }); 
    }

    rotateLeft(){
        this.collidePoints.rotation -= 0.05;
        this.aim.rotation -= 0.05;
        this.backAim.rotation -= 0.05;
        this.elm.rotation -= 0.05;  
    }

    rotateRight(){
        this.collidePoints.rotation += 0.05;
        this.aim.rotation += 0.05;
        this.backAim.rotation += 0.05;
        this.elm.rotation += 0.05;
        
    }

    rotateUp(){
        if(this.isAccelerating){ return;}
        this.isStopping = false;          
        this.isAccelerating = true;
        this.vx = 0.5;
        this.vy = 0.5;
    }

    rotateDown(){
        if(this.isStopping){return;}
        this.isAccelerating = false;
        this.isStopping = true;
    }

    destroy(){
        let frames = [];
        for (let i = 1; i <= 8; i++) {
            let key = i;
            if(i < 10){
                key = '0' + i;
            }
            frames.push(window.PIXI.Texture.fromFrame('explosion effect00' + key + '.png'));
        }

        let expl = new AnimatedSprite(frames);
        expl.scale.set(0.2);
        expl.anchor.set(0.5);
        expl.position.set(this.container.x, this.container.y);
        expl.animationSpeed = 0.2;
        expl.loop = false;

        this.stage.addChild(expl);
        expl.play();
        
        delete this.stage.ships[this.id];
        
        this.stage.removeChild(this.container);

        expl.onComplete = (() => {
            this.stage.removeChild(expl);
        });
    }

    shoot(){
        for(var i in this.toAttack){
            new Bullet({
                stage: this.stage,
                x: this.container.x,
                y: this.container.y,
                endX: this.toAttack[i].container.x,
                endY: this.toAttack[i].container.y,
                endElm: this.toAttack[i]
            });
        }
        
    }

    makeDamage(damage){
        let frames = [];
        for (let i = 1; i <= 8; i++) {
            let key = i;
            if(i < 10){
                key = '0' + i;
            }
            frames.push(window.PIXI.Texture.fromFrame('explosion effect_100' + key + '.png'));
        }

        let expl = new window.PIXI.extras.AnimatedSprite(frames);
        expl.scale.set(0.5);
        expl.anchor.set(0.5);
        expl.position.set(this.container.x, this.container.y);
        expl.animationSpeed = 0.2;
        expl.loop = false;

        this.stage.addChild(expl);
        expl.play();
        this.bodyHp -= damage;
        expl.onComplete = (() => {
            this.stage.removeChild(expl);
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

            if(this.container.vy < 1){
                this.container.vy += 0.01;
            }
        }

        if((this.container.vx < 0 || this.container.vy < 0) && this.isStopping){
            this.container.vx = 0;
            this.container.vy = 0;
            this.elm.gotoAndStop(7);
            this.isStopping = false;
            this.stopped.x = this.elm.x;
            this.stopped.y = this.elm.y;
            this.stopped.rotation = this.elm.rotation;
            this.stopped.visible = true;        
            this.elm.visible = false;
        }else if(!this.playing && this.isAccelerating){
            this.elm.visible = true;
            this.stopped.visible = false; 
            this.elm.play();
        }
        
        this.stopped.rotation = this.elm.rotation;
        this.container.x = this.container.x + this.container.vx * Math.sin(this.elm.rotation);
        this.container.y = this.container.y - this.container.vy * Math.cos(this.elm.rotation);
        
        if(this.bodyHp !== this._currentBodyHp){ // hp been changed
            if(this.bodyHp <= 0){
                return this.destroy();
            }
            if(this.bodyHp < this._currentBodyHp){
                this._currentBodyHp = this._currentBodyHp - 1;
            }else{
                this._currentBodyHp = this._currentBodyHp + 1;
            }
            
            this.renderHP();
        }
    
        this.detectEnemies();     
        this.detectNearby();
        this.detectAim(); 
        this.moveStage();
        
        if(this.isActive){
            this.detectEdgeForActive();
        }else{
            this.detectEdgeForInActive();
        }

        requestAnimationFrame(this.update.bind(this));
    }

    detectEnemies(){
        let active = this;
        this.toAttack = {};
        for(let key in this.stage.ships){
            let enemy = this.stage.ships[key];
            
            if(enemy !== this){
                enemy.stopped.alpha = 1;
                enemy.elm.alpha = 1;

                // delete this.toAttack[enemy.id];

                for(let i = 0; i < this.cps.length; i++){
                    let x = enemy.container.x + enemy.cps[i].x;
                    let y = enemy.container.y + enemy.cps[i].y;
                    let d = Math.sqrt(Math.pow(x - active.container.x, 2) + Math.pow(y - active.container.y, 2));
                    
                    if(d < active.damageZone){
                        enemy.stopped.alpha = 0.5;
                        enemy.elm.alpha = 0.5;
                        active.toAttack[enemy.id] = enemy;
                    }
                }
                
            }
        }
    }

    detectNearby(){
        let active = this;
        this.nearbyShips = {};
        for(let key in this.stage.ships){
            let enemy = this.stage.ships[key];
            
            if(enemy !== this){
                enemy.stopped.alpha = 1;
                enemy.elm.alpha = 1;

                // delete this.nearbyShips[enemy.id];

                for(let i = 0; i < this.cps.length; i++){
                    let x = enemy.container.x + enemy.cps[i].x;
                    let y = enemy.container.y + enemy.cps[i].y;
                    let d = Math.sqrt(Math.pow(x - active.container.x, 2) + Math.pow(y - active.container.y, 2));
                    
                    if(d < active.observableZone){
                        enemy.stopped.alpha = 0.5;
                        enemy.elm.alpha = 0.5;
                        active.nearbyShips[enemy.id] = enemy;
                    }
                }
                
            }
        }

        // console.log(_.size(this.nearbyShips));
    }

    detectAim(){
        let active = this;
        this.aimShips = {};
        this.backAimShips = {};
        for(let key in this.stage.ships){
            let enemy = this.stage.ships[key];
            
            if(enemy !== this){
                enemy.stopped.alpha = 1;
                enemy.elm.alpha = 1;
                for(let i = 0; i < this.cps.length; i++){
                    let x = enemy.container.x + enemy.cps[i].x;
                    let y = enemy.container.y + enemy.cps[i].y;
                    
                    if(active.aim.containsPoint({ x: x, y: y })){
                        active.aimShips[enemy.id] = enemy;
                    }

                    if(active.backAim.containsPoint({ x: x, y: y })){
                        active.backAimShips[enemy.id] = enemy;
                    }
                }
                
            }
        }
    }

    moveStage(){
        if(!this.isActive){
            return this;
        }

        if(this.container.y > this.app.view.height - this.observableZone && this.stageHeight + this.stage.position.y >= this.app.view.height && Math.cos(this.elm.rotation) < 0 ){
            this.stage.position.y = this.stage.position.y + this.container.vy * Math.cos(this.elm.rotation);
        }else if(this.stage.position.y < 0 && Math.abs(this.stage.position.y + this.container.position.y) <= this.observableZone && Math.cos(this.elm.rotation) > 0){
            this.stage.position.y = this.stage.position.y + this.container.vy * Math.cos(this.elm.rotation);
        } 

        if(this.container.x > this.app.view.width - this.observableZone && this.stageWidth + this.stage.position.x >= this.app.view.width && Math.sin(this.elm.rotation) > 0 ){
            this.stage.position.x = this.stage.position.x - this.container.vx * Math.sin(this.elm.rotation);
        }else if(this.stage.position.x < 0 && Math.abs(this.stage.position.x + this.container.position.x) <= this.observableZone && Math.sin(this.elm.rotation) < 0){
            this.stage.position.x = this.stage.position.x - this.container.vx * Math.sin(this.elm.rotation);
        } 

    }

    detectEdgeForActive(){
        if(this.container.x > this.stageWidth + 100){
            this.container.x = -100;
            this.container.vx = 0;
            this.stage.position.x = 0;
        }

        if(this.container.x < -100){
            this.stage.position.x = -1 * (this.stageWidth - this.app.view.width);
            this.container.x = this.stageWidth + 100;
        }


        if(this.container.y > this.stageHeight + 100){
            this.container.y = -100;
            this.container.vy = 0;
            this.stage.position.y = 0;
        }

        if(this.container.y < -100){
            this.stage.position.y = -1 * (this.stageHeight - this.app.view.height);
            this.container.y = this.stageHeight + 100;
        }
    }

    detectEdgeForInActive(){
        if(this.container.x > this.stageWidth + 100){
            this.container.x = -100;
            this.container.vx = 0;
        }

        if(this.container.x < -100){
            this.container.x = this.stageWidth + 100;
        }


        if(this.container.y > this.stageHeight + 100){
            this.container.y = -100;
            this.container.vy = 0;
        }

        if(this.container.y < -100){
            this.container.y = this.stageHeight + 100;
        }
    }
}