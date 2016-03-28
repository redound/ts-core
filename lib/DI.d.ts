import BaseObject from "./BaseObject";
export interface IDIInjectable {
    getDI(): DI;
    setDI(di: DI): void;
}
export interface DIServiceFactoryInterface {
    (di: DI): any;
}
export default class DI extends BaseObject {
    private _services;
    private _cache;
    constructor();
    get(key: string, shared?: boolean): any;
    getShared(key: string): any;
    set(key: string, service: DIServiceFactoryInterface | any, shared?: boolean): void;
    setShared(key: string, service: DIServiceFactoryInterface | any): this;
    reset(): this;
    private _instantiate(service);
}
