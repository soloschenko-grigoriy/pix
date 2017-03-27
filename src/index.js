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

    stage.ships[1]= new Ship({ 
        stage: stage, 
        isActive: true, 
        noAutoRender: true, 
        id: 1 })
    .render();

    for(var i = 2; i <= 10; i++){
        stage.ships[i] = new Ship({ 
            stage: stage, 
            x: Math.floor(Math.random() * 480) + 20, 
            y: Math.floor(Math.random() * 280) + 20, 
            bodyHp: Math.floor(Math.random() * 100) + 0, 
            isEnemy: true, 
            isActive: false, 
            noAutoRender: true, 
            id: i
        }).render();
    }

    document.body.appendChild(app.view);
}