const abs = (n) => {
    return (n>=0)?n:-n
}
const Bera = class {
    constructor () {
        this.num = 2
    }
    next (num) {
        if ((num - this.num<=0) || (num - this.num>3)) {
            return -3
        }
        if (num > 30) {
            return -1 // bot win
        }
        if (num == 30) {
            return -2 // user win
        }
        if (num % 4 != 2) {
            this.num = num
            while (this.num % 4 != 2) {
                this.num += 1
            }
            return this.num
        } else {
            this.num = num + Math.floor(Math.random() * 2) + 1;
            return this.num
        }
    }
}
module.exports = Bera