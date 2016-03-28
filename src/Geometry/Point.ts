import BaseObject from "../BaseObject";

export default class Point extends BaseObject {

    public x:number;
    public y:number;

    /**
     * Constructor function
     * @param x Position value for x. Defaults to zero.
     * @param y Position value for y. Defaults to zero.
     */
    constructor(x:number = 0, y:number = 0) {

        super();

        this.x = x;
        this.y = y;
    }

    /**
     * Translate points values.
     *
     * @param x Value to increase x position with.
     * @param y Value to increase y position with.
     */
    public translate(x:number, y:number) {

        this.x += x;
        this.y += y;
    }
}
