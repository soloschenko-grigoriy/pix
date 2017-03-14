var Sprite = window.PIXI.Sprite,
    Loader = window.PIXI.loader;

export default class Bullet{
    constructor(params){
        this.elm = new Sprite(Loader.resources["assets/img/cannon-ball.png"].texture);

        this.elm.x = params.x;
        this.elm.y = params.y;

        this.startX = params.x;
        this.startY = params.y;
        this.endX = params.endX;
        this.endY = params.endY;

        this.speed = 5;

        this.stage = params.stage;     

        if(params.noAutoRender){
            return;
        }

        this.render();   
    }

    get stage(){
        return this._stage;
    }

    set stage(value){
        this._stage = value;
    }

    render(){
        this.elm.scale.set(0.3);
        this.elm.anchor.set(0.5);

        this.distance = Math.sqrt(Math.pow(this.endX-this.startX,2)+Math.pow(this.endY-this.startY,2));

        this.vx = (this.endX-this.startX) / this.distance * this.speed;
        this.vy = (this.endY-this.startY) / this.distance * this.speed;

        this.moving = true;

        this.stage.addChild(this.elm);

        requestAnimationFrame(this.update.bind(this));
    }

    destroy(){
        this.stage.removeChild(this.elm);
    }

    update(){
        requestAnimationFrame(this.update.bind(this));

        if(this.moving){
            this.elm.x += this.vx;
            this.elm.y += this.vy;

            if(Math.sqrt(Math.pow(this.elm.y-this.startX,2)+Math.pow(this.elm.y-this.startY,2)) >= this.distance){
                this.moving = false;
                this.destroy();
            }
        }
    }
}