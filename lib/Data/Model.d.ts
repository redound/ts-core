import BaseObject from "../BaseObject";
export interface ModelInterface {
    new (data?: any): Model;
    primaryKey(): any;
    whitelist(): string[];
    defaults(): any;
}
export default class Model extends BaseObject {
    constructor(data?: any);
    set(key: string, value: any): void;
    get(key: string): any;
    static primaryKey(): string;
    static whitelist(): string[];
    static defaults(): any;
    getId(): any;
    assign(data?: any): this;
    assignAll(data?: any): this;
    merge(model: Model): void;
    equals(data: any): boolean;
    getDataKeys(): string[];
    toObject(recursive?: boolean, skipObjects?: any[]): any;
    static recursiveToObject(data: any, skipObjects?: any[]): any;
    toString(): string;
}
