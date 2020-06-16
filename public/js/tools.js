function getPositions(w, h, amount, limitArray) {
    let positions = [];
    let min = Math.ceil(1);
    let max = Math.floor(w * h);
    for (let i = 0; i < amount; i++) {
        let pos = Math.floor(Math.random() *(max - min + 1)) + min;
        if (!positions.includes(pos)) {
            positions.push(pos);
        } else {
            i--
        }
    }
    
    if (limitArray) {
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            for (let j = 0; j < limitArray.length; j++) {
                const limPos = limitArray[j];
                if (pos === limPos) {
                    let newPos = Math.floor(Math.random() *(max - min + 1)) + min;
                    if (positions.includes(newPos)) {
                        i--;
                        break;
                    } else {
                        positions[i] = newPos
                        i--;
                        break;
                    }
                } else {
                    continue;
                }
            }
        }
    }

    return positions
};

function posToCoords(w, h, positions) {
    let coords = [];
    let counter = 0;
    for (let i = 1; i <= h; i++) {
        for (let j = 1; j <= w; j++) {
            counter++;
            for (let k = 0; k < positions.length; k++) {
                let pos = positions[k];
                if (pos === counter) {
                    coords.push({h : i, w: j});
                }
            }
        }
    }

    return coords;
};
