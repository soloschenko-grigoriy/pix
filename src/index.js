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
    .load(init);

function init(){
    var stage = new Container();
    stage.ships = [];
    app.stage.addChild(stage);    

    

    
    new Sea({ stage: stage });
    
    let ship1 = new Ship({ stage: stage, isActive: true, noAutoRender: true, id: 1 });
    let ship2 = new Ship({ stage: stage, x: 300, y: 100, bodyHp: 50, isEnemy: true, isActive: false, noAutoRender: true, id: 2 });
    let ship3 = new Ship({ stage: stage, x: 200, y: 100, bodyHp: 25, isEnemy: true, isActive: false, noAutoRender: true, id: 3 });
    let ship4 = new Ship({ stage: stage, x: 400, y: 130, bodyHp: 75, isEnemy: true, isActive: false, noAutoRender: true, id: 4 });
    let ship5 = new Ship({ stage: stage, x: 100, y: 160, bodyHp: 55, isEnemy: true, isActive: false, noAutoRender: true, id: 5 });

    stage.ships.push(ship1);
    stage.ships.push(ship2);
    stage.ships.push(ship3);
    stage.ships.push(ship4);
    stage.ships.push(ship5);

    ship1.render();
    ship2.render();
    ship3.render();
    ship4.render();
    ship5.render();

    document.body.appendChild(app.view);
}