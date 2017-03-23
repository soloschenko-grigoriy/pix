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
    .load(init);

function init(){
    var stage = new Container();
    stage.ships = [];
    app.stage.addChild(stage);    

    new Sea({ stage: stage });
    
    // new Ship({ stage: stage, x: 450, y: 250, bodyHp: 90, isEnemy: true, isActive: false });

    let ship1 = new Ship({ stage: stage, isActive: true, noAutoRender: true, id: 1 });
    let ship2 = new Ship({ stage: stage, x: 300, y: 100, bodyHp: 50, isEnemy: true, isActive: false, noAutoRender: true, id: 2 });
    let ship3 = new Ship({ stage: stage, x: 200, y: 100, bodyHp: 25, isEnemy: true, isActive: false, noAutoRender: true, id: 3 });

    stage.ships.push(ship1);
    stage.ships.push(ship2);
    stage.ships.push(ship3);

    ship1.render();
    ship2.render();
    ship3.render();
    document.body.appendChild(app.view);
}