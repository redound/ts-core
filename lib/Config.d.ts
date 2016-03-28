import EventEmitter from "./Events/EventEmitter";
export default class Config extends EventEmitter {
    private _cache;
    private _data;
    constructor(data?: any);
    get(key?: string): any;
    set(key: string, value: any): this;
    load(value: any): this;
    has(key: string): boolean;
    clear(key?: string): this;
}
