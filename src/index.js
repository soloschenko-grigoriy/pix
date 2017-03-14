var app          = new window.PIXI.Application(800, 600, { backgroundColor: 0x1099bb}),
    Container    = window.PIXI.Container,
    Loader       = window.PIXI.loader;

import Ship from './entities/ship';
import Sea from './entities/sea';

var stage    = new Container(), 
    toUpdate = [];

Loader
    .add('assets/img/sea.png')
    .add('assets/img/ship0.json')
    .add('assets/img/ship0-stop.png')
    .add('assets/img/cannon-ball.png')
    .load(init);

function init(){
    app.stage.addChild(stage);    

    toUpdate.push(new Sea({ stage: stage }));
    toUpdate.push(new Ship({ stage: stage }));

    document.body.appendChild(app.view);
}