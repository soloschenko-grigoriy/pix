var Sprite = window.PIXI.Sprite,
    Loader = window.PIXI.loader;

export default class Sea{
    constructor(params){
        this.elm = new Sprite(Loader.resources["assets/img/sea.png"].texture);
        this.elm.position.x = 0;
        this.elm.position.y = 0;

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
        this.stage.addChild(this.elm);
    }

    update(){

    }
}