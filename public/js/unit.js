class Unit {
    constructor(id, w, h, maxW, maxH, energy, maxAge, generation) {
        this.id = id;
        this.energy = energy;
        this.age = 0;
        this.generation = generation;
        this.w = parseInt(w);
        this.h = parseInt(h);
        this.maxW = maxW;
        this.maxH = maxH;
        this.defaultEnergy = energy;
        this.maxAge = maxAge;
    }

    pushLife() {
        $(`#${this.h}_${this.w}`).css('background', 'blue').addClass('unit');
    }

    live(interval, walk) {
        this.interval = setInterval(() => {
            this.walk();
            this.age++;

            if (this.age === (this.maxAge / 2) && this.energy > this.defaultEnergy) {
                let cords = this.getRandomEmptySquere();
                this.energy = this.energy - this.defaultEnergy;
                let child = new Unit(`f${(+new Date).toString(16)}`, cords.w, cords.h, this.maxW, this.maxH, this.defaultEnergy, this.maxAge, this.generation + 1);
                child.pushLife();
                child.watchAround();
                walk[child.id] = child.live(interval, walk);
            }
            if (this.energy <= 0 || this.age >= this.maxAge) {
                clearInterval(this.interval);
                delete walk[this.id];
                this.die();
            }
            
        }, interval);

        return this.interval;
    }

    watchAround() {
        let result = {
            blocked: [],
            food: [],
            unit: [],
            empty: [],
            died: []
        };

        let around = this.getAroundCords()

        for (let i = 0; i < around.length; i++) {
            const aCord = around[i];

            if (aCord.w === 0 || aCord.h === 0 || aCord.w === this.maxW + 1 || aCord.h === this.maxH + 1) {
                result.blocked.push(aCord);
            } else if ($(`#${aCord.h}_${aCord.w}`).hasClass('food')) {
                result.food.push(aCord);
            } else if ($(`#${aCord.h}_${aCord.w}`).hasClass('unit')) {
                result.unit.push(aCord);
            } else if ($(`#${aCord.h}_${aCord.w}`).hasClass('died')) {
                result.died.push(aCord);
            } else {
                result.empty.push(aCord);
            }
        }

        this.around = result;

        return result
    }

    getAroundCords() {
        //round begins from top left squere
        //
        //  *  -  -
        //  -  U  -
        //  -  -  -
        
        return [{
            w: this.w - 1,
            h: this.h - 1
        }, {
            w: this.w,
            h: this.h - 1
        }, {
            w: this.w + 1,
            h: this.h - 1
        }, {
            w: this.w - 1,
            h: this.h
        }, {
            w: this.w + 1,
            h: this.h
        }, {
            w: this.w - 1,
            h: this.h + 1
        }, {
            w: this.w,
            h: this.h + 1
        }, {
            w: this.w + 1,
            h: this.h + 1
        }]
    }

    move(w, h) {
        let classes = $(`#${h}_${w}`).attr('class').split(' ');
        if(classes.includes('food')) {
            this.eat(w, h)
        }
        $(`#${this.h}_${this.w}`).animate({
            backgroundColor: 'white'
        }).removeClass('unit');
        this.w = w;
        this.h = h;
        $(`#${this.h}_${this.w}`).animate({
            backgroundColor: 'blue'
        }).addClass('unit');
        this.watchAround();
        this.energy = this.energy - 1;
    }

    die() {
        $(`#${this.h}_${this.w}`).css('background', 'white').removeClass('unit');
        $(`#${this.h}_${this.w}`).css('background', 'black').addClass('died');
    }

    reproduction() {
        this.energy = this.energy - this.defaultEnergy;
    }

    getRandomEmptySquere() {
        console.log("Unit -> getRandomEmptySquere -> this.around", this.around)
        if (this.around.empty.length > 0) {
            let min = Math.ceil(0);
            let max = Math.floor(this.around.empty.length - 1)
            let result = Math.floor(Math.random() * (max - min + 1)) + min;
            return this.around.empty[result]
        } else {
            return {w: this.w, h: this.h}
        }
    }

    getRandomSquere() {
        if(this.around.food.length > 0) {
            let min = Math.ceil(0);
            let max = Math.floor(this.around.food.length - 1)
            let result = Math.floor(Math.random() * (max - min + 1)) + min;
            return this.around.food[result]
        } else if (this.around.empty.length > 0) {
            let min = Math.ceil(0);
            let max = Math.floor(this.around.empty.length - 1)
            let result = Math.floor(Math.random() * (max - min + 1)) + min;
            return this.around.empty[result]
        } else {
            return {w: this.w, h: this.h}
        }
    }

    emptyWalk() {
        let cords = this.getRandomEmptySquere();
        this.move(cords.w, cords.h);
    }

    walk() {
        let cords = this.getRandomSquere();
        this.move(cords.w, cords.h);
    }

    eat(w, h) {
        $(`#${h}_${w}`).removeClass('food');
        $(`#${h}_${w}`).removeClass('square');
        let foodEnergy = parseInt($(`#${h}_${w}`).attr('class'));
        $(`#${h}_${w}`).removeClass(foodEnergy.toString());
        this.energy = this.energy + foodEnergy;
        $(`#${h}_${w}`).addClass('square');

    }
}