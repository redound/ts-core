import BaseObject from "../BaseObject";
export default class Exception extends BaseObject {
    message: string;
    code: number;
    data: {};
    name: string;
    constructor(message: string, code?: number, data?: {});
    toString(): string;
}
