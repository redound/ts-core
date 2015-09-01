/// <reference path="./Dictionary.ts" />

module TSCore.Data {

    export interface IRemoteStorage {
        getItem(key): any;
        setItem(key: string, value: any): void;
        removeItem(key: string): void;
        clear(): void;
    }

    export class Store extends TSCore.Data.Dictionary<string, any> {

        /**
         * Instantiates new store.
         *
         * @param _storage  Storage object like HTML5's localStorage
         * @param data      Initial data
         */
        constructor(protected _storage: IRemoteStorage, data?: IDictionaryData) {
            super(data);

            this.load();
        }

        /**
         * Loads properties from storage into store.
         *
         * @returns {void}
         */
        load(): void {

            for (var key in this._storage) {
                this.set(key, this._storage[key]);
            }
        }

        /**
         * Get value for key in store.
         *
         * @param key Key to return value for.
         * @returns {any}
         */
        get(key: string): any {

            super.get(key);
        }

        /**
         * Set value for key in store.
         *
         * @param key Key to set item for.
         * @param value Value to set for given key.
         */
        set(key: string, value: any): void {

            super.set(key, value);
            this._storage.setItem(key, value);
        }

        /**
         * Remove value for key in store.
         *
         * @param key   Key to remove item for.
         * @returns {null}
         */
        remove(key: string): void {

            super.remove(key);
            this._storage.removeItem(key);
        }

        /**
         * Clear the store.
         *
         * @returns {void}
         */
        clear(): void {

            super.clear();
            this._storage.clear();
        }
    }
}