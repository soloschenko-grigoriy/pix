var Sprite          = window.PIXI.Sprite,
    Loader          = window.PIXI.loader,
    Texture         = window.PIXI.Texture,
    AnimatedSprite  = window.PIXI.extras.AnimatedSprite;

import Bullet from './bullet';

export default class Ship{
    constructor(params){
        this._bodyHp    = params.bodyHp || 100;
        this._sailHp    = params.sailHp || 100;
        this._bullets   = params.bullets || 0;
        this._speed     = params.speed || 1;

        this._stage = params.stage;

        if(params.noAutoRender){
            return;
        }

        this.render();
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

    render(){
        let frames = [];
        for (let i = 1; i < 15; i++) {
            frames.push(Texture.fromFrame(i + '.png'));
        }

        this.stopped = new Sprite( Loader.resources["assets/img/ship0-stop.png"].texture);
        this.stopped.anchor.set(0.5);
        this.stopped.visible = false;
        this.stopped.scale.x = 0.3;
        this.stopped.scale.y = 0.3;
        this.stopped.x = 300;
        this.stopped.y = 300;
        this.stopped.visible = true;
        this._stage.addChild(this.stopped);

        this.anim = new AnimatedSprite(frames);
        this.anim.anchor.set(0.5);
        this.anim.x = 300;
        this.anim.y = 300;
        this.anim.gotoAndStop(7);
        this.anim.rotation = -Math.PI/3;
        this.anim.animationSpeed = 0.2;
        this.anim.scale.x = 0.3;
        this.anim.scale.y = 0.3;
        this.anim.visible = false;
        this._stage.addChild(this.anim);


        this.anim.vx = 0;
        this.anim.vy = 0;
        this.anim.vr = 0;
        this.anim.isStopping = false;
        this.anim.isAccelerating = false;

        this.addListeners();
        requestAnimationFrame(this.update.bind(this));
    }

    addListeners(){
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
        this.anim.rotation -= 0.05;  
    }

    _rotateRight(){
        this.anim.rotation += 0.05;
        
    }

    _rotateUp(){
        if(this.anim.isAccelerating){ return;}
        this.anim.isStopping = false;          
        this.anim.isAccelerating = true;
        this.anim.vx = 1;
        this.anim.vy = 1;
    }

    _rotateDown(){
        if(this.anim.isStopping){return;}
        this.anim.isAccelerating = false;
        this.anim.isStopping = true;
    }

    move(){

    }

    fire(){

    }

    destroy(){

    }

    shoot(){
        new Bullet({
            stage: this.stage,
            x: this.anim.x,
            y: this.anim.y,
            endX: 100,
            endY: 100
        });
    }

    update(){
        if(this.anim.isStopping){
            this.anim.vx -= 0.03;
            this.anim.vy -= 0.03;
        }
        
        if(this.anim.isAccelerating){
            if(this.anim.vx < 2){
                this.anim.vx += 0.01;
            }

            if(this.anim.vy < 2){
                this.anim.vy += 0.01;
            }
        }

        if((this.anim.vx < 0 || this.anim.vy < 0) && this.anim.isStopping){
            this.anim.vx = 0;
            this.anim.vy = 0;
            this.anim.gotoAndStop(7);
            this.anim.isStopping = false;
            this.anim.visible = false;
            this.stopped.x = this.anim.x;
            this.stopped.y = this.anim.y;
            this.stopped.rotation = this.anim.rotation;
            this.stopped.visible = true;        
        }else if(!this.anim.playing && this.anim.isAccelerating){
            this.anim.visible = true;
            this.stopped.visible = false; 
            this.anim.play();
        }
        
        this.anim.rotation += this.anim.vr;
        this.stopped.rotation = this.anim.rotation;
        this.anim.x = this.anim.x + this.anim.vx * Math.sin(this.anim.rotation);
        this.anim.y = this.anim.y - this.anim.vy * Math.cos(this.anim.rotation);
        
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

        requestAnimationFrame(this.update.bind(this));
    }
}