/// <reference path="TSCore.ts" />
/// <reference path="../TSCore/Data/Collection/Dictionary.ts" />

module TSCore {

    import Dictionary = TSCore.Data.Collection.Dictionary;

    export interface IDIInjectable {
        getDI(): DI;
        setDI(di: DI): void;
    }

    export interface IDIServiceFactory {
        (di:DI): any
    }

    interface IDIServiceItem {
        service: any,
        shared: boolean
    }

    export class DI {

        private _services: Dictionary<string, IDIServiceItem>;
        private _cache: Dictionary<string, any>;

        constructor(){
            this._services = new Dictionary<string, IDIServiceItem>();
            this._cache = new Dictionary<string, any>();
        }

        public get(key: string, shared: boolean = false): any {

            var serviceItem = this._services.get(key);
            var instance:any = null;

            var instantiateShared = shared === true || serviceItem.shared === true;

            if(instantiateShared && this._cache.contains(key)){
                instance = this._cache.get(key);
            }

            if(!instance){
                instance = this._instantiate(serviceItem.service);
            }

            if(instantiateShared){
                this._cache.set(key, instance);
            }

            return instance;
        }

        public getShared(key: string): any {

            return this.get(key, true);
        }

        public set(key: string, service: IDIServiceFactory|any, shared: boolean = false): void {

            this._services.set(key, {
                service: service,
                shared: shared
            });
        }

        public setShared(key: string, service: IDIServiceFactory|any): void {

            this.set(key, service, true);
        }

        public reset(): void {

            this._services.clear();
        }

        private _instantiate(service:any): {} {

            var instance:any = null;

            if(_.isFunction(service)){
                instance = service(this);
            }
            else {
                instance = service;
            }

            if(instance.setDI){
                instance.setDI(this);
            }

            return service;
        }
    }
}