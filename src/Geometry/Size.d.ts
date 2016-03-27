/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
export default class Size extends BaseObject {
    width: number;
    height: number;
    /**
     * Constructor function.
     *
     * @param width Width value of size.
     * @param height Height value of size.
     */
    constructor(width?: number, height?: number);
    /**
     * Return the half of size's width.
     *
     * @returns {number}
     */
    halfWidth(): number;
    /**
     * Return the half of size's height.
     * @returns {number}
     */
    halfHeight(): number;
}
