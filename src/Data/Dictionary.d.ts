/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export declare module DictionaryEvents {
    const ADD: string;
    const CHANGE: string;
    const REMOVE: string;
    const CLEAR: string;
    interface ChangeParamsInterface {
    }
    interface ChangeParamsInterface {
    }
    interface AddParamsInterface<K, V> {
        key: K;
        value: V;
    }
    interface RemoveParamsInterface<K, V> {
        key: K;
        value: V;
    }
}
export interface DictionaryDataInterface {
    [key: string]: DictionaryKeyValuePairInterface;
}
export interface DictionaryIteratorInterface<K, V> {
    (key: K, value: V): any;
}
export interface DictionaryKeyValuePairInterface {
    key: any;
    originalKey: any;
    value: any;
}
export default class Dictionary<K, V> extends BaseObject {
    private static _OBJECT_UNIQUE_ID_KEY;
    private static _OBJECT_UNIQUE_ID_COUNTER;
    protected _data: DictionaryDataInterface;
    protected _itemCount: number;
    events: EventEmitter;
    constructor(data?: DictionaryDataInterface);
    /**
     * Get value for key in dictionary.
     *
     * @param key Key to return value for.
     * @returns {any}
     */
    get(key: K): V;
    /**
     * Set value for key in dictionary.
     *
     * @param key Key to set item for.
     * @param value Value to set for given key.
     */
    set(key: K, value: V): void;
    /**
     * Remove value for key in dictionary.
     *
     * @param key   Key to remove item for.
     * @returns {null}
     */
    remove(key: K): V;
    /**
     * Check if dictionary contains key.
     *
     * @param key Key to check against.
     * @returns {boolean}
     */
    contains(key: K): boolean;
    containsValue(value: V): boolean;
    /**
     * Iterate over each key/value pair in dictionary.
     *
     * @param iterator
     */
    each(iterator: DictionaryIteratorInterface<K, V>): void;
    /**
     * Get all values in dictionary.
     *
     * @returns {V[]}
     */
    values(): V[];
    /**
     * Get all keys in dictionary.
     *
     * @returns {K[]}
     */
    keys(): K[];
    /**
     * Count all pairs in dictionary.
     *
     * @returns {number}
     */
    count(): number;
    /**
     * Check if dictionary is empty/
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Clear the dictionary.
     *
     * @returns {void}
     */
    clear(): void;
    toObject(): {};
    toArray(): V[];
    all(): V[];
    clone(): Dictionary<K, V>;
    /**
     * Get pair for key in dictionary.
     *
     * @param key Key to get pair for.
     * @returns {DictionaryKeyValuePairInterface}
     * @private
     */
    protected _getPair(key: K): DictionaryKeyValuePairInterface;
    /**
     * Get string version for key in dictionary.
     *
     * @param key Key to get string for.
     * @returns {any}
     * @private
     */
    protected _getKeyString(key: K): string;
    /**
     * Assign unique id to object.
     *
     * @param object Object to assign id to.
     * @private
     */
    protected _assignUniqueID(object: Object): void;
}
