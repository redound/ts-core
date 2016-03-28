import BaseObject from "../BaseObject";
export default class Size extends BaseObject {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    halfWidth(): number;
    halfHeight(): number;
}
