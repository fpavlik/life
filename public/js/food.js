class Food {
    constructor(w, h, energy) {
        this.w = w;
        this.h = h;
        this.energy = energy;
    }

    pushFood() {
        $(`#${this.h}_${this.w}`).css('background-color', 'green').addClass(`food ${this.energy}`);
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

    getRandomEmptySquere() {
        if (this.around.empty.length > 0) {
            let min = Math.ceil(0);
            let max = Math.floor(this.around.empty.length - 1)
            let result = Math.floor(Math.random() * (max - min + 1)) + min;
            return this.around.empty[result]
        } else {
            return {w: this.w, h: this.h}
        }
    }
}