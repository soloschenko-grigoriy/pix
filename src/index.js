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
     
    app.stage.addChild(stage);    

    new Sea({ stage: stage });
    new Ship({ stage: stage });
    new Ship({ stage: stage, x: 500, y: 500, bodyHp: 50, isEnemy: true });
    new Ship({ stage: stage, x: 450, y: 250, bodyHp: 90, isEnemy: true });

    document.body.appendChild(app.view);
}