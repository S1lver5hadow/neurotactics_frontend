export default class Point {
    constructor(x=0, y=0, x_percent=0, y_percent=0) {
        this.x = x;
        this.y = y;
        this.x_percent = x_percent;
        this.y_percent = y_percent;
    }

    distance(x, y) {
        return Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2))
    }
}