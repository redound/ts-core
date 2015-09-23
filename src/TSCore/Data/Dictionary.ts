/// <reference path="../Events/EventEmitter.ts" />
/// <reference path="Set.ts" />

module TSCore.Data {

    export interface IDictionaryData { [key:string]: IKeyValuePair }

    export interface IDictionaryIterator<K, V> {
        (key:K, value:V);
    }

    export module DictionaryEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const CLEAR:string = "clear";

        export interface IChangeParams {}
        export interface IClearParams {}

        export interface IAddParams<K, V> {
            key: K,
            value: V
        }

        export interface IRemoveParams<K, V> {
            key: K,
            value: V
        }
    }

    export class Dictionary<K, V> extends TSCore.Events.EventEmitter {

        private static _OBJECT_UNIQUE_ID_KEY = '__TSCore_Object_Unique_ID';
        private static _OBJECT_UNIQUE_ID_COUNTER = 1;

        protected _data: IDictionaryData;
        protected _itemCount:number = 0;


        constructor(data?: IDictionaryData){

            super();
            this._data = data || {};
        }

        /**
         * Get value for key in dictionary.
         *
         * @param key Key to return value for.
         * @returns {any}
         */
        public get(key: K): V {

            var foundPair = this._getPair(key);
            return foundPair ? foundPair.value : null;
        }

        /**
         * Set value for key in dictionary.
         *
         * @param key Key to set item for.
         * @param value Value to set for given key.
         */
        public set(key: K, value: V) {

            if(key == null || key == undefined){
                return;
            }

            if(_.isObject(key)){
                this._assignUniqueID(key);
            }

            var alreadyExisted = this.contains(key);

            var keyString = this._getKeyString(key);
            this._data[keyString] = {
                key: keyString,
                value: value
            };

            if(!alreadyExisted){
                this._itemCount++;
            }

            this.trigger(DictionaryEvents.ADD, { key: key, value: value });
            this.trigger(DictionaryEvents.CHANGE);
        }

        /**
         * Remove value for key in dictionary.
         *
         * @param key   Key to remove item for.
         * @returns {null}
         */
        public remove(key: K): V {

            var removedItem = null;
            var foundPair = this._getPair(key);

            if(foundPair){

                delete this._data[foundPair.key];
                removedItem = foundPair.value;

                this._itemCount--;

                this.trigger(DictionaryEvents.REMOVE, { key: key, value: removedItem });
                this.trigger(DictionaryEvents.CHANGE);
            }

            return removedItem;
        }

        /**
         * Check if dictionary contains key.
         *
         * @param key Key to check against.
         * @returns {boolean}
         */
        public contains(key: K): boolean {
            return this._getPair(key) != null;
        }

        public containsValue(value: V): boolean {

            var foundValue:V = null;

            this.each((itKey:K, itValue:V) => {

                if(itValue == value){

                    foundValue = itValue;
                    return false;
                }
            });

            return foundValue != null;
        }

        /**
         * Get first item from dictionary
         * @returns {any}
         */
        public first(): V {
            for (var key in this._data) {
                return this._data[key];
            }
            return null;
        }

        /**
         * Return last item from dictionary
         * @returns {IKeyValuePair|null}
         */
        public last(): V {
            for (var key in this._data) {
                var value = this._data[key];
            }
            return value || null;
        }

        /**
         * Iterate over each key/value pair in dictionary.
         *
         * @param iterator
         */
        public each(iterator:IDictionaryIterator<K,V>): void {

            _.each(this._data, (pair) => {
                return iterator(pair.key, pair.value);
            });
        }

        /**
         * Get all values in dictionary.
         *
         * @returns {any[]}
         */
        public values(): K[] {
            return _.pluck(_.values(this._data), 'value');
        }

        /**
         * Get all keys in dictionary.
         *
         * @returns {any[]}
         */
        public keys(): K[] {
            return _.pluck(_.values(this._data), 'key');
        }

        /**
         * Count all pairs in dictionary.
         *
         * @returns {number}
         */
        public count(): number {
            return this._itemCount;
        }

        /**
         * Check if dictionary is empty/
         *
         * @returns {boolean}
         */
        public isEmpty(): boolean {
            return this.count() === 0;
        }

        /**
         * Clear the dictionary.
         *
         * @returns {void}
         */
        public clear(): void {

            this._data = {};
            this._itemCount = 0;

            this.trigger(DictionaryEvents.CLEAR);
            this.trigger(DictionaryEvents.CHANGE);
        }

        /**
         * Get pair for key in dictionary.
         *
         * @param key Key to get pair for.
         * @returns {IKeyValuePair}
         * @private
         */
        protected _getPair(key: K): IKeyValuePair {

            var keyString = this._getKeyString(key);
            var foundPair:IKeyValuePair = null;

            if(keyString != null && keyString != undefined){
                foundPair = this._data[keyString];
            }

            return foundPair;
        }

        /**
         * Get string version for key in dictionary.
         *
         * @param key Key to get string for.
         * @returns {any}
         * @private
         */
        protected _getKeyString(key: K): string {

            if(key == null || key == undefined){
                return null;
            }

            if(_.isString(key)){
                return 's_' + key;
            }
            else if(_.isNumber(key)){
                return 'n_' + key;
            }
            else {
                return key[Dictionary._OBJECT_UNIQUE_ID_KEY];
            }
        }

        /**
         * Assign unique id to object.
         *
         * @param object Object to assign id to.
         * @private
         */
        protected _assignUniqueID(object: Object): void {

            object[Dictionary._OBJECT_UNIQUE_ID_KEY] = '_' + Dictionary._OBJECT_UNIQUE_ID_COUNTER;
            Dictionary._OBJECT_UNIQUE_ID_COUNTER++;
        }
    }
}