/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
export default class Point extends BaseObject {
    x: number;
    y: number;
    /**
     * Constructor function
     * @param x Position value for x. Defaults to zero.
     * @param y Position value for y. Defaults to zero.
     */
    constructor(x?: number, y?: number);
    /**
     * Translate points values.
     *
     * @param x Value to increase x position with.
     * @param y Value to increase y position with.
     */
    translate(x: number, y: number): void;
}
