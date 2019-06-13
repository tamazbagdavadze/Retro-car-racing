/**
 * Created by tazo on 12/30/2015.
 */

const RetroCarRacing = (function() {

    'use strict';

    const Car = function(side, y) {
        this.y = y;
        this.side = side;
    };

    const sides = {
        left: 0,
        center: 1,
        right: 2
    };

    sides[0] = 0;
    sides[1] = 1;
    sides[2] = 2;

    const maxScoreName = 'RetroCarRacingByTazo';

    let domElement = null;
    let infoDomElement = null;
    let levelDomElement = null;
    let scoreDomElement = null;
    let maxScoreDomElement = null;
    let ctx = null;
    let screenWidth = null;
    let screenHeight = null;
    let squareWidth = null;
    let emptyRoadSquareNumber = 1;
    let cars = [];
    let myCar = null;
    const roadHeightSegments = 18;
    const roadWidthSegments = 11;
    let interval = 200;
    const intervalLimit = 80;
    let intervalId = null;
    let score = 0;
    let level = 0;

    // TODO rewrite smarter...
    function drawCar(car) {

        let x = squareWidth;
        let y = (car.y - 4) * squareWidth;

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

        const width = squareWidth;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, width);

        const innerSquareWidth = width / 4;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        const _from = innerSquareWidth / 2;
        const to = width - _from;

        for (let i = _from; i < to; i += innerSquareWidth) {
            for (let j = to - innerSquareWidth; j > _from - innerSquareWidth; j -= innerSquareWidth) {
                ctx.fillRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
                ctx.strokeRect(x + i, y + j, innerSquareWidth, innerSquareWidth);
            }
        }
    }

    //TODO crashes when height is 0
    function resize() {

        const bodyWidth = parseInt(getComputedStyle(document.body).width.slice(0, -2), 10);

        if (bodyWidth < screenWidth) { //TODO fix width change
            screenWidth = bodyWidth;
            screenHeight = screenWidth / roadWidthSegments * roadHeightSegments;
        } else {
            screenHeight = parseInt(getComputedStyle(domElement).height.slice(0, -2), 10);
            screenWidth = Math.floor(screenHeight / roadHeightSegments * roadWidthSegments);
        }

        squareWidth = Math.floor(screenWidth / roadWidthSegments);
        screenWidth = roadWidthSegments * squareWidth; // pixel perfect :v

        domElement.setAttribute('height', screenHeight);
        domElement.setAttribute('width', screenWidth);

        render();
    }

    function checkCollision() {
        const collidedCars = cars.filter(function (car) {
            return car.side === myCar.side && (
                car.y > myCar.y && car.y < myCar.y + 4 ||
                car.y < myCar.y && car.y > myCar.y - 4);
        });

        return collidedCars.length;
    }

    function keyDown(e) {
        switch (e.which) {

            /* left */
            case 37:
                {
                    if (myCar.side !== sides.left) {
                        myCar.side--;
                    }
                    break;
                }

                /* up */
            case 38:
                {

                    break;
                }

                /*right*/
            case 39:
                {
                    if (myCar.side !== sides.right) {
                        myCar.side++;
                    }
                    break;
                }

                /* down */
            case 40:
                {

                    break;
                }
        }

        render();
    }

    function oneStep() {
        emptyRoadSquareNumber = (2 + emptyRoadSquareNumber) % 4;

        const newScore = cars.filter(function (car) {
            return car.y === myCar.y + 4;
        }).length;

        if (newScore) {
            setScore(score + newScore);
        }

        cars = cars.filter(function(car) {
            return car.y < 22;
        }); // delete passed cars
        cars.forEach(function(car) {
            car.y++;
        });

        const r = Math.floor(Math.random() * 1000);

        let addNewCar = r % (8 - level < 2 ? 2 : 8 - level) === 0;
        const side = sides[r % 3];

        const overlapsExistingCar = cars.filter(function (car) {
            return car.side === side && car.y < 4;
        }).length;

        const isPath = checkPath(side); //TODO revert in func

        if (overlapsExistingCar || !isPath) {
            addNewCar = false;
        }

        if (addNewCar) {
            let car = new Car(side, 0);
            cars.push(car);
        }

        if (checkCollision()) {
            alert('გაასხი! თავიდან... (ქულა: ' + score + ')');
            restart();
        }

        render();
    }

    function setScore(newScore) {
        score = newScore;
        if (score % 10 === 0 && score !== 0) {
            setLevel(Math.floor(score / 10));
        }
        scoreDomElement.innerText = "score : " + score + ". ";
        updateMaxScore();
    }

    function updateMaxScore() {
        let oldStr = localStorage.getItem(maxScoreName);

        let old = 0;

        if(oldStr){
            old = parseInt(oldStr, 10);
        }

        const maxScore = old > score ? old : score;
        maxScoreDomElement.innerText = 'max : ' + maxScore;
        localStorage.setItem(maxScoreName, maxScore.toString(10));
    }

    function setLevel(newLevel) {

        level = newLevel;
        levelDomElement.innerText = "level : " + newLevel + ".  ";

        if (interval > intervalLimit && newLevel !== 0) {
            interval -= 30;
            clearInterval(intervalId);
            intervalId = setInterval(oneStep, interval);
        } else
        if (interval <= intervalLimit && interval + 20 > intervalLimit) {
            interval -= 2;
            clearInterval(intervalId);
            intervalId = setInterval(oneStep, interval);
        }
    }

    //TODO fix
    function checkPath(side) {

        const m = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        m[side][0] = 1; // new car
        m[myCar.side][6] = 1; // my car

        //fill array with cars
        cars.forEach(function(car) {
            const index = Math.floor((car.y) / 4);
            m[car.side][index] = 1;

            if (car.y % 4 > 0) {
                m[car.side][index + 1] = 1;
            }
        });

        let existsPath = false;

        function rec(x, y) {

            if (existsPath)
                return;

            m[x][y] = 1;

            if (y === 0) {
                existsPath = true;
                return;
            }

            if (y !== 0)
                if (m[x][y - 1] === 0)
                    rec(x, y - 1);
            if (x !== 2)
                if (m[x + 1][y] === 0)
                    rec(x + 1, y);
            if (x !== 0)
                if (m[x - 1][y] === 0)
                    rec(x - 1, y);
        }

        rec(myCar.side, 6);

        return existsPath;
    }

    function restart() {
        cars = [];

        setScore(0);
        setLevel(0);

        interval = 200;
        myCar = new Car(sides.right, roadHeightSegments);

        clearInterval(intervalId);
        intervalId = setInterval(oneStep, interval);

        render();
    }

    function init() {
        ctx = domElement.getContext('2d');

        window.addEventListener('resize', resize);
        window.addEventListener('keydown', keyDown);
        window.addEventListener('touchstart', function(e) {
            localStorage.setItem('x', e.targetTouches[0].clientX.toString(10));
        });
        window.addEventListener('touchend', function(e) {
            const x = parseInt(localStorage.getItem('x'), 10);

            //noinspection JSUnresolvedVariable
            if (x > e.changedTouches[0].clientX + 20) {
                keyDown({
                    which: 37
                });
            } else {
                //noinspection JSUnresolvedVariable
                if (x < e.changedTouches[0].clientX - 20)
                    keyDown({
                        which: 39
                    });
            }
        });

        levelDomElement.innerText = 0;
        scoreDomElement.innerText = 0;

        restart();
        resize();
    }

    function clear() {
        ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    function render() {
        clear();
        drawRoad();
        drawCar(myCar);
        cars.forEach(drawCar);

        //requestAnimationFrame(render);
    }

    function drawRoad() {

        for (let i = 0; i < screenHeight / squareWidth; i++) {

            if (i % 4 === emptyRoadSquareNumber)
                continue;

            drawSquare(0, i * squareWidth);
            drawSquare(screenWidth - squareWidth, i * squareWidth);
        }
    }

    return {
        setDomElement: function(el) {
            domElement = el;
        },
        start: function() {
            init();
        },
        setInfoDomElement: function(el) {
            infoDomElement = el;

            levelDomElement = document.createElement('span');
            levelDomElement.id = 'level';

            infoDomElement.appendChild(levelDomElement);

            scoreDomElement = document.createElement('span');
            scoreDomElement.id = 'score';

            infoDomElement.appendChild(scoreDomElement);

            maxScoreDomElement = document.createElement('span');
            maxScoreDomElement.id = maxScoreName;

            infoDomElement.appendChild(maxScoreDomElement);
        }
    };
}());

window.onload = function() {
    RetroCarRacing.setDomElement(document.getElementById('canvas'));
    RetroCarRacing.setInfoDomElement(document.getElementById('info'));
    RetroCarRacing.start();
};
