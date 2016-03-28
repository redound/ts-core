import BaseObject from "./BaseObject";
import Dictionary from "./Data/Dictionary";

export interface IDIInjectable {
    getDI():DI;
    setDI(di:DI):void;
}

export interface DIServiceFactoryInterface {
    (di:DI):any
}

interface DIServiceItemInterface {
    service:any,
    shared:boolean
}

export default class DI extends BaseObject {

    private _services:Dictionary<string, DIServiceItemInterface>;
    private _cache:Dictionary<string, any>;

    /**
     * Constructor function.
     */
    constructor() {

        super();

        this._services = new Dictionary<string, DIServiceItemInterface>();
        this._cache = new Dictionary<string, any>();
    }

    /**
     * Resolves the service based on its configuration.
     *
     * @param key Name of the service.
     * @param shared Whether to get a shared instance of the service.
     * @returns {any}
     */
    public get(key:string, shared:boolean = false):any {

        var serviceItem = this._services.get(key);
        var instance = null;

        var instantiateShared = shared === true || serviceItem && serviceItem.shared === true;

        if (instantiateShared && this._cache.contains(key)) {
            instance = this._cache.get(key);
        }

        if (serviceItem && !instance) {
            instance = this._instantiate(serviceItem.service);
        }

        if (instantiateShared) {
            this._cache.set(key, instance);
        }

        return instance;
    }

    /**
     * Resolves a service, the resolved service is stored in the DI, subsequent requests
     * for this service will return the same instance.
     *
     * @param key Name of the service.
     * @returns {any}
     */
    public getShared(key:string):any {

        return this.get(key, true);
    }

    /**
     * Registers a service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     * @param shared Whether to return always the same instance.
     */
    public set(key:string, service:DIServiceFactoryInterface|any, shared:boolean = false):void {

        this._services.set(key, {
            service: service,
            shared: shared
        });
    }

    /**
     * Registers an “always shared” service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     *
     * @returns {DI}
     */
    public setShared(key:string, service:DIServiceFactoryInterface|any):this {

        this.set(key, service, true);

        return this;
    }

    /**
     * Resets the internal default DI.
     *
     * @returns {DI}
     */
    public reset():this {

        this._services.clear();

        return this;
    }

    /**
     * Instantiate a service using its factory method.
     *
     * @param service Name of the service.
     * @returns {any}
     * @private
     */
    private _instantiate(service:any):{} {

        var instance:any = null;

        if (_.isFunction(service)) {
            instance = service(this);
        }
        else {
            instance = service;
        }

        if (instance && instance.setDI) {
            instance.setDI(this);
        }

        return instance;
    }
}
