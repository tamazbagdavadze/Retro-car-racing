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

    sides[0] = 0;
    sides[1] = 1;
    sides[2] = 2;


    var domElement = null;
    var ctx = null;
    var screenWidth = null;
    var screenHeight = null;
    var squareWidth = null;
    var emptyRoadSquareNumber = 1;
    var cars = [];
    var myCar = null;
    const roadSegments = 18;
    var interval = 100;
    var intervalId = null;

    // TODO rewrite smarter...
    function drawCar(car) {

        var x = squareWidth;
        var y = car.y * squareWidth;

        x += car.side * 3 * squareWidth;

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

    function checkCollision(){
        var tempCars = cars.filter(function(car){

            console.log(myCar);
            console.log(car);

            return car.side == myCar.side &&(
                   car.y > myCar.y && car.y < myCar.y + 4 ||
                   car.y < myCar.y && car.y > myCar.y - 4);
        });

        return tempCars.length;
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

    function restart (){

        clearInterval(intervalId);
        cars = [];

        myCar = new Car(sides.right, roadSegments - 4);

        render();

        intervalId = setInterval(function () {
            emptyRoadSquareNumber = ++emptyRoadSquareNumber % 4;
            cars = cars.filter(function(car){return car.y < 18;});
            cars.forEach(function(car){car.y++;});

            var r  = Math.floor(Math.random()*10000);

            var addNewCar = r%7 == 0; // TODO analyze
            var side = sides[r%3]; // TODO make smarter

            if(cars.filter(function(car){return car.side == side && car.y < 4;}).length) // distance between cars
                addNewCar = false;

            if(cars.filter(function(car){return car.y < 7;}).length > 1)
                addNewCar = false;

            if(addNewCar){
                let car = new Car(side, 0);
                cars.push(car);
            }

            if(checkCollision()){
                alert('გაასხი! თავიდან...');

                //clearInterval(intervalId);
                //return;

                restart();
            }
        }, interval);
    }

    function init() {
        ctx = domElement.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('keydown', keyDown);

        restart();
    }

    function clear() {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    function render() {
        clear();
        drawRoad();
        drawCar(myCar);
        cars.forEach(drawCar);

        requestAnimationFrame(render);
    }

    function drawRoad() {

        for (let i = 0; i < screenHeight / squareWidth; i++) {

            if (i % 4 == emptyRoadSquareNumber)
                continue;

            drawSquare(0, i * squareWidth);
            drawSquare(screenWidth - squareWidth, i * squareWidth);
        }
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
