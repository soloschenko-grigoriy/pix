var Graphics  = window.PIXI.Graphics,
    Container = window.PIXI.Container;
    
export default class Island{

    constructor(params){
        this.app        = params.app;
        this.stage      = params.stage;
        this.bodyR      = params.bodyR;
        this.position   = params.position;
        this.imageIndex = params.imageIndex;

        this.body = this.renderBody();
        this.sprite = this.renderSprite();

        let island = new Container();
        
        island.addChild(this.sprite);
        island.addChild(this.body);

        this.stage.addChild(island);
    }

    renderSprite(){
        let sprite = new window.PIXI.Sprite(window.PIXI.Texture.fromFrame('island_' + this.imageIndex + '.png'));
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5);
        sprite.position.set(this.position.x, this.position.y);

        return sprite;
    }

    renderBody(){
        let obj = new Graphics();
        obj.lineStyle(2, 0x000000, 0);
        obj.beginFill(0x000000, 0);
        obj.drawCircle(this.position.x, this.position.y, this.bodyR);
        obj.endFill();

        return obj;
    }
}