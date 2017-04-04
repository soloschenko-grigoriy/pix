var app          = new window.PIXI.Application(800, 600, { backgroundColor: 0x1099bb, antialias: true}),
    Container    = window.PIXI.Container,
    Loader       = window.PIXI.loader;

import Ship from './entities/ship';
import Sea from './entities/sea';



Loader
    .add('assets/img/sea.png')
    .add('assets/img/ship0.json')
    .add('assets/img/ship0-stop.png')
    .add('assets/img/cannon-ball.png')
    .add('assets/img/expl1.json')
    .add('assets/img/expl2.json')
    .add('assets/img/expl3.json')
    .add('assets/img/islands.json')
    .load(init);

function init(){
    var stage = new Container();
    stage.ships = [];
    stage.islands = [];
    app.stage.addChild(stage);    
    
    stage.sea = new Sea({ stage: stage });

    stage.ships[1]= new Ship({ 
        stage: stage, 
        isActive: true, 
        noAutoRender: true, 
        id: 1,
        app: app
    }).render();

    for(var i = 2; i <= 20; i++){
        stage.ships[i] = new Ship({ 
            stage: stage, 
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

    document.body.appendChild(app.view);
}