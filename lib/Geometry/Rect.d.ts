import BaseObject from "../BaseObject";
import Point from "./Point";
import Size from "./Size";
export default class Rect extends BaseObject {
    origin: Point;
    size: Size;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    center(): Point;
    topLeft(): Point;
    bottomLeft(): Point;
    topRight(): Point;
    bottomRight(): Point;
    halfWidth(): number;
    halfHeight(): number;
    containsPoint(point: Point): boolean;
    containsRect(rect: Rect): boolean;
    intersectsRect(rect: Rect): boolean;
    inset(top: number, right: number, bottom: number, left: number): this;
    insetCenter(horizontal: number, vertical: number): this;
    expand(horizontal: number, vertical: number): this;
    reduce(horizontal: number, vertical: number): this;
}
