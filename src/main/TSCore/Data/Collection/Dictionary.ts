/// <reference path="../../../tscore.d.ts" />

module TSCore.Data.Collection {

    export interface IDictionaryData { [key:string]: IKeyValuePair }
    export interface IDictionaryIterator<K, V> {
        (key:K, value:V);
    }

    export class Dictionary<K, V> {

        private static _OBJECT_UNIQUE_ID_KEY = '__TSCore_Object_Unique_ID';
        private static _OBJECT_UNIQUE_ID_COUNTER = 1;

        protected _data: IDictionaryData;
        protected _itemCount:number;


        constructor(data?: IDictionaryData){
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
        }

        public remove(key: K): V {

            var removedItem = null;
            var foundPair = this._getPair(key);

            if(foundPair){

                delete this._data[foundPair.key];
                removedItem = foundPair.value;

                this._itemCount--;
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

        public each(iterator:IDictionaryIterator<K,V>){

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

        protected _assignUniqueID(object: Object){

            object[Dictionary._OBJECT_UNIQUE_ID_KEY] = '_' + Dictionary._OBJECT_UNIQUE_ID_COUNTER;
            Dictionary._OBJECT_UNIQUE_ID_COUNTER++;
        }
    }
}