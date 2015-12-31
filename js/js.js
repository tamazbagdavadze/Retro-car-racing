/**
 * Created by tazo on 12/30/2015.
 */


var RetroCarRacing = (function(){

    'use strict';

    var domElement = null;
    var ctx = null;
    var screenWidth = null;
    var screenHeight = null;

    function drawSquare(x,y,width){
        "use strict";
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
        screenHeight = getComputedStyle(domElement)['height'].slice(0, -2);
        screenWidth = getComputedStyle(domElement)['width'].slice(0, -2);
        domElement.setAttribute('height', screenHeight);
        domElement.setAttribute('width', screenWidth);
    }

    function init(){
        ctx = domElement.getContext('2d');
        resize();
        window.addEventListener('resize',resize);
    }

    function render(){
        requestAnimationFrame(render);
    }

    return {
        setDomElement : function(el){
            domElement = el;
        },
        start : function(){
            init();
            drawSquare(30,30,60);
        }
    };
}());

window.onload = function(){
    "use strict";

    RetroCarRacing.setDomElement(document.getElementById('canvas'));
    RetroCarRacing.start();
};
