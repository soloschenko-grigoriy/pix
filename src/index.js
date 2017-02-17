var PIXI         = require("../node_modules/pixi.js/dist/pixi.min");
var app          = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb}),
    Container    = PIXI.Container,
    Sprite       = PIXI.Sprite,
    Loader       = PIXI.loader,
    Texture      = PIXI.Texture,
    AnimatedSprite = PIXI.extras.AnimatedSprite,
    TilingSprite = PIXI.extras.TilingSprite;

var stage, anim, stopped, graphics = new PIXI.Graphics();

Loader
    .add('img/sea.png')
    .add('img/ship0.json')
    .add('img/ship1.json')
    .add('img/ship1-stop.png')
    .load(init);

function init(){
    stage = new Container();

    document.body.appendChild(app.view);
    app.stage.addChild(stage);
    
    var bg = new TilingSprite(
        Loader.resources["img/sea.png"].texture, 
        app.renderer.width,
        app.renderer.height
    );

    stage.addChild(bg);
    var i;
    var frames = [];
    for (i = 1; i < 15; i++) {
        frames.push(Texture.fromFrame(i + '.png'));
    }

    var frames2 = [];
    var index = '1000';
    for (i = 1; i < 14; i++) {
        if(i > 9){
            index = '100';
        }
        frames2.push(Texture.fromFrame('Ship_' + index + i + '.png'));
    }

    stopped = new Sprite( Loader.resources["img/ship1-stop.png"].texture);
    stopped.anchor.set(0.5);
    stopped.visible = false;
    app.stage.addChild(stopped);

    anim = new AnimatedSprite(frames);
    anim.anchor.set(0.5);
    anim.x = 300;
    anim.y = 300;
    anim.gotoAndStop(7);
    anim.rotation = -Math.PI/3;
    anim.animationSpeed = 0.2;

    app.stage.addChild(anim);
    
    // var graphics1 = new PIXI.Graphics();
    // graphics1.lineStyle(4, 0xffd900, 1);
    // graphics1.drawRect(50, 50, app.view.width - 100, app.view.height - 100);
    // app.stage.addChild(graphics1);

    anim.vx = 0;
    anim.vy = 0;
    anim.vr = 0;
    anim.isStopping = false;
    anim.isAccelerating = false;

    gameLoop();

    document.addEventListener('keydown', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(e.keyCode === 37){ // left 
            anim.rotation -= 0.05;         
        }else if(e.keyCode === 38){ // up  
            if(anim.isAccelerating){ return;}
            anim.isStopping = false;          
            anim.isAccelerating = true;
            anim.vx = 1;
            anim.vy = 1;
        }else if(e.keyCode === 39){ // right
            anim.rotation += 0.05;
        }else if(e.keyCode === 40){ // down
            if(anim.isStopping){return;}
            anim.isAccelerating = false;
            anim.isStopping = true;
        }
    }); 

}

function gameLoop(){

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    if(anim.isStopping){
        anim.vx -= 0.03;
        anim.vy -= 0.03;
    }
    
    if(anim.isAccelerating){
        if(anim.vx < 2){
            anim.vx += 0.01;
        }

        if(anim.vy < 2){
            anim.vy += 0.01;
        }
    }

    if((anim.vx < 0 || anim.vy < 0) && anim.isStopping){
        anim.vx = 0;
        anim.vy = 0;
        anim.gotoAndStop(7);
        anim.isStopping = false;
        anim.visible = false;
        stopped.x = anim.x;
        stopped.y = anim.y;
        stopped.rotation = anim.rotation;
        stopped.visible = true;        
    }else if(!anim.playing && anim.isAccelerating){
        anim.visible = true;
        stopped.visible = false; 
        anim.play();
    }
    
    anim.rotation += anim.vr;
    stopped.rotation = anim.rotation;
    anim.x = anim.x + anim.vx * Math.sin(anim.rotation);
    anim.y = anim.y - anim.vy * Math.cos(anim.rotation);
    
    if(anim.x > app.view.width - anim.width + 100|| anim.x < anim.width - 100){
        anim.vx = 0;
        // anim.isStopping = true;
        // anim.isAccelerating = false;
    }

    if(anim.y > app.view.height - 100 || anim.y <  100){
        anim.vy = 0;
        // anim.isStopping = true;
        // anim.isAccelerating = false;
    }
    // graphics.destroy();
    // graphics = new PIXI.Graphics();
    // graphics.lineStyle(4, 0xff0000, 1);
    // graphics.drawRect(anim.getBounds().x, anim.getBounds().y, anim.getBounds().width, anim.getBounds().height);
    // app.stage.addChild(graphics);

    app.render(stage);
}