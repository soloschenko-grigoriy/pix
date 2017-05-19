var _            = window._,
    app          = new window.PIXI.Application(800, 600, { backgroundColor: 0x1099bb, antialias: true}),
    Container    = window.PIXI.Container,
    Graphics     = window.PIXI.Graphics,
    Sprite       = window.PIXI.Sprite,
    Loader       = window.PIXI.loader;

import Ship from './entities/ship';
import Island from './entities/island';
import Sea from './entities/sea';
import AI from './ai';


Loader
    .add('assets/img/sea2.png')
    .add('assets/img/ship2.json')
    .add('assets/img/ship3.json')
    .add('assets/img/cannon-ball.png')
    .add('assets/img/expl1.json')
    .add('assets/img/expl2.json')
    .add('assets/img/expl3.json')
    .add('assets/img/islands.json')
    .add('assets/img/ui/fire.png')
    .add('assets/img/ui/left.png')
    .add('assets/img/ui/right.png')
    .load(init);

function init(){
    var stage = new Container();
    stage.ships = {};
    stage.islands = [];
    stage.sea = new Sea({ stage: stage });
    app.stage.addChild(stage);    
    
    
    var area = new Graphics();
    area.lineStyle(2, 0xffffff, 1);
    area.drawCircle(stage.width/2, stage.height/2, stage.width/2 - 100);
    area.endFill();
    stage.area = area;
    stage.addChild(stage.area);


    stage.ships[1] = new Ship({ 
        stage: stage, 
        isActive: true, 
        x: 350,
        y: 350,
        noAutoRender: true, 
        id: 1,
        app: app
    }).render();

    for(var i = 2; i <= 1; i++){
        stage.ships[i] = new Ship({ 
            stage: stage, 
            // x: 500,
            // y: 500,
            // bodyHp: 70, 
            x: Math.floor(Math.random() * stage.width) + 20, 
            y: Math.floor(Math.random() * stage.height) + 20, 
            bodyHp: Math.floor(Math.random() * 100) + 0, 
            
            isEnemy: true, 
            isActive: false, 
            noAutoRender: true, 
            id: i,
            app: app
        }).render();
    }
    
    new AI({
        stage: stage
    }).start();

    let islands = [        
        { x: 300, y: 550, bodyR: 100 },
        { x: 800, y: 800, bodyR: 100 },
        { x: 50, y: 120, bodyR: 100 },
        { x: 800, y: 200, bodyR: 70 },
        { x: 1100, y: 500, bodyR: 70 },
        { x: 1200, y: 900, bodyR: 70 }
    ];

    stage.islands = [];
    islands.forEach((island, i) => {
        stage.islands.push(new Island({
            app: app,
            stage: stage,
            position: {
                x: island.x,
                y: island.y
            },
            bodyR: island.bodyR,
            imageIndex: i
        }));
    });

    var active = _.find(stage.ships, (ship) => {
        return ship.isActive;
    });

    var leftDownTimeout, rightDownTimeout;
    var ui = new Container();
    var fireButton = new Sprite.fromImage('assets/img/ui/fire.png');
    fireButton.anchor.set(0.5);
    fireButton.scale.set(0.5);
    fireButton.position.set(750, 550);
    fireButton.interactive = true;
    fireButton.buttonMode = true;
    fireButton.on('click', () => {
        active.shoot();
    });

    ui.addChild(fireButton);

    var leftButton = new Sprite.fromImage('assets/img/ui/left.png');
    leftButton.anchor.set(0.5);
    leftButton.scale.set(0.5);
    leftButton.position.set(50, 550);
    leftButton.interactive = true;
    leftButton.buttonMode = true;
    leftButton.on('mousedown', () => {
        clearInterval(leftDownTimeout);
        clearInterval(rightDownTimeout);
        leftDownTimeout = setInterval(function(){
            active.rotateLeft();
        }, 100);
        
    });
    leftButton.on('mouseup', () => {
        clearInterval(leftDownTimeout);
        clearInterval(rightDownTimeout);
    });
    
    ui.addChild(leftButton);

    var rightButton = new Sprite.fromImage('assets/img/ui/right.png');
    rightButton.anchor.set(0.5);
    rightButton.scale.set(0.5);
    rightButton.position.set(130, 550);
    rightButton.interactive = true;
    rightButton.buttonMode = true;
    rightButton.on('mousedown', () => {
        clearInterval(rightDownTimeout);
        clearInterval(leftDownTimeout);
        rightDownTimeout = setInterval(function(){
            active.rotateRight();
        }, 100);

    });

    rightButton.on('mouseup', () => {
        clearInterval(rightDownTimeout);
        clearInterval(leftDownTimeout);
    });
    
    ui.addChild(rightButton);
    app.stage.addChild(ui);    

    document.body.appendChild(app.view);
}