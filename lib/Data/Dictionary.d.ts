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
    get(key: K): V;
    set(key: K, value: V): void;
    remove(key: K): V;
    contains(key: K): boolean;
    containsValue(value: V): boolean;
    each(iterator: DictionaryIteratorInterface<K, V>): void;
    values(): V[];
    keys(): K[];
    count(): number;
    isEmpty(): boolean;
    clear(): void;
    toObject(): {};
    toArray(): V[];
    all(): V[];
    clone(): Dictionary<K, V>;
    protected _getPair(key: K): DictionaryKeyValuePairInterface;
    protected _getKeyString(key: K): string;
    protected _assignUniqueID(object: Object): void;
}
