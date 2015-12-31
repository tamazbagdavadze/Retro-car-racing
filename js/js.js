/**
 * Created by tazo on 12/30/2015.
 */


var RetroCarRacing = (function () {

    'use strict';

    var Car = function (side, y) {
        this.y = y;
        this.side = side;
    };

    var sides = {
        left: 0,
        center: 1,
        right: 2
    };


    var domElement = null;
    var ctx = null;
    var screenWidth = null;
    var screenHeight = null;
    var squareWidth = null;
    var emptyRoadSquareNumber = 1;
    var cars = [];
    var myCar = null;


    function drawCar(car) {

        var x = squareWidth;
        var y = car.y * squareWidth;

        switch (car.side) {
            case sides.left:
            {
                break;
            }
            case sides.center:
            {
                x += (3 * squareWidth);
                break;
            }
            case sides.right:
            {
                x += (6 * squareWidth);
                break;
            }
        }

        drawSquare(x + squareWidth, y);

        y += squareWidth / 1;

        drawSquare(x, y);
        drawSquare(x + squareWidth, y);
        drawSquare(x + 2 * squareWidth, y);

        y += squareWidth / 1;

        drawSquare(x + squareWidth, y);

        y += squareWidth / 1;

        drawSquare(x, y);
        drawSquare(x + 2 * squareWidth, y);
    }

    function drawSquare(x, y) {
        "use strict";

        var width = squareWidth;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, width);

        var innerSquareWidth = width / 4;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        var from = innerSquareWidth / 2;
        var to = width - from;

        for (let i = from; i < to; i += innerSquareWidth) {
            for (let j = to - innerSquareWidth; j > from - innerSquareWidth; j -= innerSquareWidth) {
                ctx.fillRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
                ctx.strokeRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
            }
        }
    }

    function resize() { //TODO crashes when height is 0

        var bodyWidth = parseInt(getComputedStyle(document.body)['width'].slice(0, -2), 10);

        if (bodyWidth < screenWidth) { //TODO fix width change
            screenWidth = bodyWidth;
            screenHeight = screenWidth / 11 * 18;
        } else {
            screenHeight = parseInt(getComputedStyle(domElement)['height'].slice(0, -2), 10);
            screenWidth = Math.floor(screenHeight / 18 * 11);
        }

        squareWidth = Math.floor(screenWidth / 11);
        screenWidth = 11 * squareWidth; // pixel perfect :v

        domElement.setAttribute('height', screenHeight);
        domElement.setAttribute('width', screenWidth);
    }

    function keyDown(e) {
        switch (e.which) {

            /* left */
            case 37:{
                if(myCar.side != sides.left){
                    myCar.side--;
                }
                break;
            }

            /* up */
            case 38: {

                break;
            }

            /*right*/
            case 39: {
                if(myCar.side != sides.right){
                    myCar.side++;
                }
                break;
            }

            /* down */
            case 40:{

                break;
            }
        }
    }

    function init() {
        ctx = domElement.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('keydown', keyDown);

        myCar = new Car(sides.right, 14);

        render();
        setInterval(function () {
            emptyRoadSquareNumber = ++emptyRoadSquareNumber % 4;
        }, 200);
    }

    function clear() {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    function render() {
        clear();
        drawRoad();

        drawCar(myCar);

        requestAnimationFrame(render);
    }

    function drawRoad() {

        for (let i = 0; i < screenHeight / squareWidth; i++) {

            if (i % 4 == emptyRoadSquareNumber)
                continue;

            drawSquare(0, i * squareWidth);
            drawSquare(screenWidth - squareWidth, i * squareWidth);
        }

        //for(let i = 0; i< screenWidth / squareWidth; i++ ){
        //    drawSquare(i * squareWidth, 0);
        //}
    }

    return {
        setDomElement: function (el) {
            domElement = el;
        },
        start: function () {
            init();
        }
    };
}());

window.onload = function () {
    "use strict";

    RetroCarRacing.setDomElement(document.getElementById('canvas'));
    RetroCarRacing.start();
};
