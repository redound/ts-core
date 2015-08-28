/// <reference path="../../Event/EventEmitter.ts" />
/// <reference path="Set.ts" />

module TSCore.Data.Collection {

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
        protected _itemCount:number;


        constructor(data?: IDictionaryData){

            super();
            this._data = data || {};
        }

        public get(key: K): V {

            var foundPair = this._getPair(key);
            return foundPair ? foundPair.value : null;
        }

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

        public each(iterator:IDictionaryIterator<K,V>): void {

            _.each(this._data, (pair) => {
                return iterator(pair.key, pair.value);
            });
        }

        public values(): K[] {
            return _.pluck(_.values(this._data), 'value');
        }

        public keys(): K[] {
            return _.pluck(_.values(this._data), 'key');
        }

        public count(): number {
            return this._itemCount;
        }

        public isEmpty(): boolean {
            return this.count() === 0;
        }

        public clear(){

            this._data = {};
            this._itemCount = 0;

            this.trigger(DictionaryEvents.CLEAR);
            this.trigger(DictionaryEvents.CHANGE);
        }


        protected _getPair(key: K): IKeyValuePair {

            var keyString = this._getKeyString(key);
            var foundPair:IKeyValuePair = null;

            if(keyString != null && keyString != undefined){
                foundPair = this._data[keyString];
            }

            return foundPair;
        }

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

        protected _assignUniqueID(object: Object): void {

            object[Dictionary._OBJECT_UNIQUE_ID_KEY] = '_' + Dictionary._OBJECT_UNIQUE_ID_COUNTER;
            Dictionary._OBJECT_UNIQUE_ID_COUNTER++;
        }
    }
}