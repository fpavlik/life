$(document).ready(function(){
    
    function addFood(config) {
        const positions = getPositions(config.w, config.h, config.food);
        config.foodPositions = positions;
        const coords = posToCoords(config.w, config.h, positions);
        let foods = [];
    
        for (let i = 0; i < coords.length; i++) {
            let coord = coords[i];
            let food = new Food(coord.w, coord.h, config.foodEnergy);
            food.pushFood();
            foods.push(food);
        }
    
        return foods
    };

    function addLife(config) {
        const positions = getPositions(config.w, config.h, config.unitsAmount, config.foodPositions);
        const coords = posToCoords(config.w, config.h, positions);
        let units = [];
    
        for (let i = 0; i < coords.length; i++) {
            let coord = coords[i];
            let unit = new Unit(`f${(+new Date).toString(16)}`, coord.w, coord.h, config.w, config.h, config.unitEnergy, config.maxAge, 0);
            unit.pushLife();
            unit.watchAround();
            units[i] = unit;
            console.log("addLife -> units", units)
        }
    
        return units
    };

    let walk = {};

    $('#live').on('click', () => {
        const config = {
            maxAge : parseInt($('input#maxAge').val()),
            unitsAmount : parseInt($('input#unitsAmount').val()),
            food : parseInt($('input#food').val()),
            stepTime: parseInt($('input#stepTime').val()),
            w: parseInt($('p#w').text()),
            h: parseInt($('p#h').text()),
            unitEnergy: parseInt($('input#unitEnergy').val()),
            foodEnergy: parseInt($('input#foodEnergy').val())          
        };
        config.unitTimeStep = parseInt(config.stepTime / config.unitsAmount);

        let foods = addFood(config);
        let units = addLife(config);

        foods.forEach(food => {
            setInterval(() => {
                food.watchAround();
                let growChance = Math.random() * 101;
                if (growChance < 3.5) {
                    let coord = food.getRandomEmptySquere();
                    let newFood = new Food(coord.w, coord.h, config.foodEnergy);
                    newFood.pushFood();
                    foods.push(newFood);
                }
            }, config.stepTime);
        });

        units.forEach((unit, i) => {
            setTimeout(() => {
                walk[unit.id] = unit.live(config.stepTime, walk);
                console.log("walk", walk)
            }, config.unitTimeStep * i);
        });
    });

    $('#stop').on('click', () => {
        for (const key in walk) {
            if (walk.hasOwnProperty(key)) {
                clearInterval(walk[key]);
                console.log("walk", walk)
                
            }
        }
    });

});