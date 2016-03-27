/// <reference path="../typings/main.d.ts" />
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
    /**
     * Constructor function.
     */
    constructor();
    /**
     * Resolves the service based on its configuration.
     *
     * @param key Name of the service.
     * @param shared Whether to get a shared instance of the service.
     * @returns {any}
     */
    get(key: string, shared?: boolean): any;
    /**
     * Resolves a service, the resolved service is stored in the DI, subsequent requests
     * for this service will return the same instance.
     *
     * @param key Name of the service.
     * @returns {any}
     */
    getShared(key: string): any;
    /**
     * Registers a service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     * @param shared Whether to return always the same instance.
     */
    set(key: string, service: DIServiceFactoryInterface | any, shared?: boolean): void;
    /**
     * Registers an “always shared” service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     *
     * @returns {DI}
     */
    setShared(key: string, service: DIServiceFactoryInterface | any): this;
    /**
     * Resets the internal default DI.
     *
     * @returns {DI}
     */
    reset(): this;
    /**
     * Instantiate a service using its factory method.
     *
     * @param service Name of the service.
     * @returns {any}
     * @private
     */
    private _instantiate(service);
}
