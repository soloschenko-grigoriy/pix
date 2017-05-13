var _            = window._,
    app          = new window.PIXI.Application(800, 600, { backgroundColor: 0x1099bb, antialias: true}),
    Container    = window.PIXI.Container,
    Sprite       = window.PIXI.Sprite,
    Loader       = window.PIXI.loader;

import Ship from './entities/ship';
import Sea from './entities/sea';
import AI from './ai';


Loader
    .add('assets/img/sea.png')
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
    app.stage.addChild(stage);    
    
    stage.sea = new Sea({ stage: stage });

    stage.ships[1] = new Ship({ 
        stage: stage, 
        isActive: true, 
        x: 400,
        y: 400,
        noAutoRender: true, 
        id: 1,
        app: app
    }).render();


    

    for(var i = 2; i <= 2; i++){
        stage.ships[i] = new Ship({ 
            stage: stage, 
            x: 200,
            y: 200,
            bodyHp: 70, 
            // x: Math.floor(Math.random() * stage.width) + 20, 
            // y: Math.floor(Math.random() * stage.height) + 20, 
            // bodyHp: Math.floor(Math.random() * 100) + 0, 
            
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

    let positions = [
        {},
        { x: 100, y: 100 },
        { x: 300, y: 450 },
        { x: 800, y: 800 },
        { x: 300, y: 1000 },
        { x: 500, y: 1200 },
        { x: 200, y: 1400 },
        { x: 800, y: 200 },
        { x: 1100, y: 500 },
        { x: 1200, y: 900 },
        { x: 1500, y: 1000 },
    ]

    for(let i = 1; i <= 10; i++){
        let island = new window.PIXI.Sprite(window.PIXI.Texture.fromFrame('island_' + i + '.png'));
        island.anchor.set(0.5, 0.5);
        island.scale.set(0.5);
        island.position.set(positions[i].x, positions[i].y);
        stage.addChild(island);
        stage.islands.push(island);
    }

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