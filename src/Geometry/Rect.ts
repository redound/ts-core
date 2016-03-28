import BaseObject from "../BaseObject";
import Point from "./Point";
import Size from "./Size";

export default class Rect extends BaseObject {

    public origin:Point;
    public size:Size;

    /**
     * Magic getter for x origin position.
     *
     * @returns {number}
     */
    public get x():number {
        return this.origin.x;
    }

    /**
     * Magic setter for x origin position.
     *
     * @param x Origin position value for x.
     */
    public set x(x:number) {
        this.origin.x = x;
    }

    /**
     * Magic getter for y origin position.
     *
     * @returns {number}
     */
    public get y():number {
        return this.origin.y;
    }

    /**
     * Magic setter for y origin position.
     *
     * @param y Origin position value for y.
     */
    public set y(y:number) {
        this.origin.y = y;
    }

    /**
     * Magic getter for width.
     *
     * @returns {number}
     */
    public get width() {
        return this.size.width;
    }

    /**
     * Magic setter for width.
     *
     * @param width Value for width.
     */
    public set width(width:number) {
        this.size.width = width;
    }

    /**
     * Magic getter for height.
     *
     * @returns {number}
     */
    public get height() {
        return this.size.height;
    }

    /**
     * Magic setter for height.
     *
     * @param height Value for height.
     */
    public set height(height:number) {
        this.size.height = height;
    }

    /**
     * Constructor function.
     *
     * @param x Origin position value for x.
     * @param y Origin position value for y.
     * @param width Value for width.
     * @param height Value for height.
     */
    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {

        super();

        this.origin = new Point(x, y);
        this.size = new Size(width, height);
    }

    /**
     * Get point instance for center position of rect.
     *
     * @returns {Point}
     */
    public center():Point {
        return new Point(this.origin.x + this.size.halfWidth(), this.origin.y + this.size.halfHeight());
    }

    /**
     * Get point instance for topLeft position of rect.
     *
     * @returns {Point}
     */
    public topLeft():Point {
        return new Point(this.origin.x, this.origin.y);
    }

    /**
     * Get point instance for bottomLeft position of rect.
     *
     * @returns {Point}
     */
    public bottomLeft():Point {
        return new Point(this.origin.x, this.origin.y + this.size.height);
    }

    /**
     * Get point instance for topRight position of rect.
     *
     * @returns {Point}
     */
    public topRight():Point {
        return new Point(this.origin.x + this.size.width, this.origin.y);
    }

    /**
     * Get point instance for bottomRight position of rect.
     *
     * @returns {Point}
     */
    public bottomRight():Point {
        return new Point(this.origin.x + this.size.width, this.origin.y + this.size.height);
    }

    /**
     * Get the half of rect's width.
     *
     * @returns {number}
     */
    public halfWidth():number {
        return this.size.halfWidth()
    }

    /**
     * Get the half of rect's height.
     *
     * @returns {number}
     */
    public halfHeight():number {
        return this.size.halfHeight()
    }

    /**
     * Check if rect's position contains point's position.
     *
     * @param point
     * @returns {boolean}
     */
    public containsPoint(point:Point):boolean {

        var topLeft = this.topLeft();
        var bottomRight = this.bottomRight();

        return point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y;
    }

    /**
     * Check if rect's position contains another rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    public containsRect(rect:Rect):boolean {

        return this.containsPoint(rect.topLeft()) && this.containsPoint(rect.bottomRight());
    }

    /**
     * Check if rect's position intersects rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    public intersectsRect(rect:Rect):boolean {

        return this.containsPoint(rect.topLeft()) || this.containsPoint(rect.bottomLeft()) || this.containsPoint(rect.topRight()) || this.containsPoint(rect.bottomRight());
    }

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
    public inset(top:number, right:number, bottom:number, left:number):this {

        this.origin.x += left;
        this.origin.y += top;
        this.size.width -= right;
        this.size.height -= bottom;

        return this;
    }

    /**
     * Inset center of rect.
     *
     * @param horizontal Value for rect's horizontal position.
     * @param vertical Value for rect's vertical position.
     *
     * @returns {Rect}
     */
    public insetCenter(horizontal:number, vertical:number):this {
        this.inset(vertical / 2, horizontal / 2, vertical / 2, horizontal / 2);

        return this;
    }

    /**
     * Expand rect.
     * @param horizontal Value for rect's horizontal expand position.
     * @param vertical Value for rect's vertical expand position.
     *
     * @returns {Rect}
     */
    public expand(horizontal:number, vertical:number):this {
        this.insetCenter(-horizontal, -vertical);

        return this;
    }

    /**
     * Reduce rect.
     *
     * @param horizontal Value for rect's horizontal reduce position.
     * @param vertical Value for rect's vertical reduce position.
     *
     * @returns {Rect}
     */
    public reduce(horizontal:number, vertical:number):this {
        this.insetCenter(horizontal, vertical);

        return this;
    }
}
