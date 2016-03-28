import BaseObject from "../BaseObject";
export default class Point extends BaseObject {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    translate(x: number, y: number): void;
}
