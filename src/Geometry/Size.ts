import BaseObject from "../BaseObject";

export default class Size extends BaseObject {

    public width:number;
    public height:number;

    /**
     * Constructor function.
     *
     * @param width Width value of size.
     * @param height Height value of size.
     */
    constructor(width:number = 0, height:number = 0) {

        super();

        this.width = width;
        this.height = height;
    }

    /**
     * Return the half of size's width.
     *
     * @returns {number}
     */
    public halfWidth():number {
        return this.width / 2;
    }

    /**
     * Return the half of size's height.
     * @returns {number}
     */
    public halfHeight():number {
        return this.height / 2;
    }
}
