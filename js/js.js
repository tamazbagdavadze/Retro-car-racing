/**
 * Created by tazo on 12/30/2015.
 */


var RetroCarRacing = (function(){

    'use strict';

    var domElement = null;
    var ctx = null;
    var screenWidth = null;
    var screenHeight = null;
    var squareWidth = null;
    var emptyRoadSquareNumber = 1;

    function drawSquare(x,y){
        "use strict";

        var width = squareWidth;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, width);

        var innerSquareWidth = width/4;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        var from = innerSquareWidth / 2;
        var to = width - from;

        for(let i = from; i < to; i += innerSquareWidth){
            for(let j = to - innerSquareWidth; j > from - innerSquareWidth ; j -= innerSquareWidth){
                ctx.fillRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
                ctx.strokeRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
            }
        }
    }

    function resize(){

        screenHeight = parseInt(getComputedStyle(domElement)['height'].slice(0, -2), 10);
        screenWidth = screenHeight / 18 * 10;

        var bodyWidth = parseInt(getComputedStyle(document.body)['width'].slice(0, -2), 10);

        if(bodyWidth < screenWidth){
            screenWidth = bodyWidth;
            screenHeight = screenWidth / 10 * 18;
        }

        domElement.setAttribute('height', screenHeight);
        domElement.setAttribute('width', screenWidth);

        clear();

        squareWidth = Math.floor(screenWidth / 10);
    }

    function init(){
        ctx = domElement.getContext('2d');
        resize();
        window.addEventListener('resize',resize);
        render();

        setInterval(function(){
            emptyRoadSquareNumber = ++emptyRoadSquareNumber % 4;
        }, 100);
    }

    function clear(){
        ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    function render(){
        clear();
        drawRoad();
        requestAnimationFrame(render);
    }

    function drawRoad(){

        for(let i = 0; i < screenHeight / squareWidth; i++){

            if(i % 4 == emptyRoadSquareNumber)continue;

            drawSquare(0, i * squareWidth);
            drawSquare(screenWidth - squareWidth, i * squareWidth);
        }
    }

    return {
        setDomElement : function(el){
            domElement = el;
        },
        start : function(){
            init();
        }
    };
}());

window.onload = function(){
    "use strict";

    RetroCarRacing.setDomElement(document.getElementById('canvas'));
    RetroCarRacing.start();
};
