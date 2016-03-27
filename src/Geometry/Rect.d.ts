/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import Point from "./Point";
import Size from "./Size";
export default class Rect extends BaseObject {
    origin: Point;
    size: Size;
    /**
     * Magic getter for x origin position.
     *
     * @returns {number}
     */
    /**
     * Magic setter for x origin position.
     *
     * @param x Origin position value for x.
     */
    x: number;
    /**
     * Magic getter for y origin position.
     *
     * @returns {number}
     */
    /**
     * Magic setter for y origin position.
     *
     * @param y Origin position value for y.
     */
    y: number;
    /**
     * Magic getter for width.
     *
     * @returns {number}
     */
    /**
     * Magic setter for width.
     *
     * @param width Value for width.
     */
    width: number;
    /**
     * Magic getter for height.
     *
     * @returns {number}
     */
    /**
     * Magic setter for height.
     *
     * @param height Value for height.
     */
    height: number;
    /**
     * Constructor function.
     *
     * @param x Origin position value for x.
     * @param y Origin position value for y.
     * @param width Value for width.
     * @param height Value for height.
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     * Get point instance for center position of rect.
     *
     * @returns {Point}
     */
    center(): Point;
    /**
     * Get point instance for topLeft position of rect.
     *
     * @returns {Point}
     */
    topLeft(): Point;
    /**
     * Get point instance for bottomLeft position of rect.
     *
     * @returns {Point}
     */
    bottomLeft(): Point;
    /**
     * Get point instance for topRight position of rect.
     *
     * @returns {Point}
     */
    topRight(): Point;
    /**
     * Get point instance for bottomRight position of rect.
     *
     * @returns {Point}
     */
    bottomRight(): Point;
    /**
     * Get the half of rect's width.
     *
     * @returns {number}
     */
    halfWidth(): number;
    /**
     * Get the half of rect's height.
     *
     * @returns {number}
     */
    halfHeight(): number;
    /**
     * Check if rect's position contains point's position.
     *
     * @param point
     * @returns {boolean}
     */
    containsPoint(point: Point): boolean;
    /**
     * Check if rect's position contains another rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    containsRect(rect: Rect): boolean;
    /**
     * Check if rect's position intersects rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    intersectsRect(rect: Rect): boolean;
    /**
     * Inset rect.
     *
     * @param top Value for rect's top position.
     * @param right Value for rect's right position.
     * @param bottom Value for rect's bottom position.
     * @param left Value for rect's left position.
     *
     * @returns {Rect}
     */
    inset(top: number, right: number, bottom: number, left: number): this;
    /**
     * Inset center of rect.
     *
     * @param horizontal Value for rect's horizontal position.
     * @param vertical Value for rect's vertical position.
     *
     * @returns {Rect}
     */
    insetCenter(horizontal: number, vertical: number): this;
    /**
     * Expand rect.
     * @param horizontal Value for rect's horizontal expand position.
     * @param vertical Value for rect's vertical expand position.
     *
     * @returns {Rect}
     */
    expand(horizontal: number, vertical: number): this;
    /**
     * Reduce rect.
     *
     * @param horizontal Value for rect's horizontal reduce position.
     * @param vertical Value for rect's vertical reduce position.
     *
     * @returns {Rect}
     */
    reduce(horizontal: number, vertical: number): this;
}
