import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export module DictionaryEvents {

    export const ADD:string = "add";
    export const CHANGE:string = "change";
    export const REMOVE:string = "remove";
    export const CLEAR:string = "clear";

    export interface ChangeParamsInterface {
    }

    export interface ChangeParamsInterface {
    }

    export interface AddParamsInterface<K, V> {
        key:K,
        value:V
    }

    export interface RemoveParamsInterface<K, V> {
        key:K,
        value:V
    }
}

export interface DictionaryDataInterface {
    [key:string]:DictionaryKeyValuePairInterface
}

export interface DictionaryIteratorInterface<K, V> {
    (key:K, value:V);
}

export interface DictionaryKeyValuePairInterface {
    key:any,
    originalKey:any,
    value:any
}

export default class Dictionary<K, V> extends BaseObject {

    private static _OBJECT_UNIQUE_ID_KEY = '__TSCore_Object_Unique_ID';
    private static _OBJECT_UNIQUE_ID_COUNTER = 1;

    protected _data:DictionaryDataInterface;
    protected _itemCount:number = 0;

    public events:EventEmitter = new EventEmitter();


    constructor(data?:DictionaryDataInterface) {

        super();

        this._data = data || {};
        this._itemCount = Object.keys(this._data).length;
    }

    /**
     * Get value for key in dictionary.
     *
     * @param key Key to return value for.
     * @returns {any}
     */
    public get(key:K):V {

        var foundPair = this._getPair(key);
        return foundPair ? foundPair.value : null;
    }

    /**
     * Set value for key in dictionary.
     *
     * @param key Key to set item for.
     * @param value Value to set for given key.
     */
    public set(key:K, value:V) {

        if (key == null || key == undefined) {
            return;
        }

        if (_.isObject(key)) {
            this._assignUniqueID(key);
        }

        var alreadyExisted = this.contains(key);

        var keyString = this._getKeyString(key);
        this._data[keyString] = {
            key: keyString,
            originalKey: key,
            value: value
        };

        if (!alreadyExisted) {
            this._itemCount++;
        }

        this.events.trigger(DictionaryEvents.ADD, {key: key, value: value});
        this.events.trigger(DictionaryEvents.CHANGE);
    }

    /**
     * Remove value for key in dictionary.
     *
     * @param key   Key to remove item for.
     * @returns {null}
     */
    public remove(key:K):V {

        var removedItem = null;
        var foundPair = this._getPair(key);

        if (foundPair) {

            delete this._data[foundPair.key];
            removedItem = foundPair.value;

            this._itemCount--;

            this.events.trigger(DictionaryEvents.REMOVE, {key: key, value: removedItem});
            this.events.trigger(DictionaryEvents.CHANGE);
        }

        return removedItem;
    }

    /**
     * Check if dictionary contains key.
     *
     * @param key Key to check against.
     * @returns {boolean}
     */
    public contains(key:K):boolean {
        return this._getPair(key) != null;
    }

    public containsValue(value:V):boolean {

        var foundValue:V = null;

        this.each((itKey:K, itValue:V) => {

            if (itValue == value) {

                foundValue = itValue;
                return false;
            }
        });

        return foundValue != null;
    }

    /**
     * Iterate over each key/value pair in dictionary.
     *
     * @param iterator
     */
    public each(iterator:DictionaryIteratorInterface<K,V>):void {

        _.each(this._data, (pair) => {
            return iterator(pair.originalKey, pair.value);
        });
    }

    /**
     * Get all values in dictionary.
     *
     * @returns {V[]}
     */
    public values():V[] {
        return _.pluck(_.values(this._data), 'value');
    }

    /**
     * Get all keys in dictionary.
     *
     * @returns {K[]}
     */
    public keys():K[] {
        return _.pluck(_.values(this._data), 'originalKey');
    }

    /**
     * Count all pairs in dictionary.
     *
     * @returns {number}
     */
    public count():number {
        return this._itemCount;
    }

    /**
     * Check if dictionary is empty/
     *
     * @returns {boolean}
     */
    public isEmpty():boolean {
        return this.count() === 0;
    }

    /**
     * Clear the dictionary.
     *
     * @returns {void}
     */
    public clear():void {

        this._data = {};
        this._itemCount = 0;

        this.events.trigger(DictionaryEvents.CLEAR);
        this.events.trigger(DictionaryEvents.CHANGE);
    }

    public toObject():{} {

        var result = {};

        _.each(_.values(this._data), (item:DictionaryKeyValuePairInterface) => {
            result[item.originalKey] = item.value;
        });

        return result;
    }

    public toArray():V[] {
        return this.values();
    }

    public all():V[] {
        return this.values();
    }

    public clone():Dictionary<K, V> {
        return new Dictionary<K, V>(this._data);
    }


    /**
     * Get pair for key in dictionary.
     *
     * @param key Key to get pair for.
     * @returns {DictionaryKeyValuePairInterface}
     * @private
     */
    protected _getPair(key:K):DictionaryKeyValuePairInterface {

        var keyString = this._getKeyString(key);
        var foundPair:DictionaryKeyValuePairInterface = null;

        if (keyString != null && keyString != undefined) {
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
    protected _getKeyString(key:K):string {

        if (key == null || key == undefined) {
            return null;
        }

        if (_.isString(key)) {
            return 's_' + key;
        }
        else if (_.isNumber(key)) {
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
    protected _assignUniqueID(object:Object):void {

        object[Dictionary._OBJECT_UNIQUE_ID_KEY] = '_' + Dictionary._OBJECT_UNIQUE_ID_COUNTER;
        Dictionary._OBJECT_UNIQUE_ID_COUNTER++;
    }
}
