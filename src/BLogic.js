class BLogic {
    constructor({start, solved, heruistic}) {
        this.zX = 0;
        this.zY = 0;
        this.h  = 0;
        this.g  = 0;

        this.unsolvedMap= start;
        this.solvedMap  = solved;
        this.heruistic  = heruistic;

        this.call = (name) => {
            if (this[name])
                return this[name]();
        };

        for (let i = 0; i < this.unsolvedMap.length; i++) {
            let indx = this.unsolvedMap[i].findIndex((el) => el == 0);
            if (indx !== -1) {
                this.zX = i;
                this.zY = indx;
                break ;
            }
        }

        if (this.heruistic == 2) {
            this.h = 0;
            for (let i = 0; i < this.unsolvedMap.length; i++) {
                for (let j = 0; j < this.unsolvedMap[i].length; j++) {
                    if (this.unsolvedMap[i][j] != this.solvedMap[i][j])
                        this.h++;
                }
            }
        } else {
            for (let i = 0; i < this.unsolvedMap.length; i++) {
                for (let j = 0; j < this.unsolvedMap[i].length; j++) {
                    if (this.unsolvedMap[i][j] != (this.solvedMap[i][j])) {
                        this.h += Math.abs(this.getCoord('x', this.solvedMap, this.unsolvedMap[i][j]) - i) +
                            Math.abs(this.getCoord('y', this.solvedMap, this.unsolvedMap[i][j]) - j);
                    }
                }
                if (this.heruistic == 3)
                    this.h += this.LC(this.unsolvedMap[i], i);
            }
        }
    }

    getCoord (coord, arr, valEqual) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] == valEqual) {
                    return coord == 'x' ? i : j;
                }
            }
        }
    }

     LC(arr, index) {
        let res = 0;

        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < this.dmnsn(); j++) {
                if (!this.checkCollected(arr[i], arr[j], i, j, index))
                    res++;
            }
        }

        return res;
     }

     checkCollected(val1, val2, y1, y2, index) {
        if (this.solvedMap[index].find((el) => val1 == el) !== undefined) {
            let fVal1 = this.solvedMap[index].findIndex((el) => val1 == el);
            if (this.solvedMap[index].find((el) => val2 == el) !== undefined) {
                let fVal2 = this.solvedMap[index].findIndex((el) => val2 == el);
                if ((fVal1 > fVal2 && y1 < y2) || (fVal2 > fVal1 && y2 < y1))
                    return 0;
            }
        }
        return 1;
     }

     inclusions() {
        let res = [];
        res.push(this.castling(this.unsolvedMap, this.zX, this.zY, this.zX, this.zY + 1));
        res.push(this.castling(this.unsolvedMap, this.zX, this.zY, this.zX, this.zY - 1));
        res.push(this.castling(this.unsolvedMap, this.zX, this.zY, this.zX - 1, this.zY));
        res.push(this.castling(this.unsolvedMap, this.zX, this.zY, this.zX + 1, this.zY));

        return res;
     }

     castling(b, posX1, posY1, posX2, posY2) {
        if (posX2 > -1 && posX2 < this.dmnsn() && posY2 > -1 && posY2 < this.dmnsn()) {

            let tmpMap = [];
            for (let i = 0; i < b.length; i++) {
                tmpMap[i] = [];
                for (let j = 0; j < b[i].length; j++) {
                    tmpMap[i][j] = b[i][j];
                }
            }

            let tmp = tmpMap[posX2][posY2];
            tmpMap[posX2][posY2] = tmpMap[posX1][posY1];
            tmpMap[posX1][posY1] = tmp;

            return new BLogic({start: tmpMap, solved: this.solvedMap, heruistic: this.heruistic});
        } else return null ;
     }

     dmnsn () {
        return this.unsolvedMap.length;
     }

     end () {
        return this.h == 0;
     }
}

module.exports = BLogic;
