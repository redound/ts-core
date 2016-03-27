/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export interface ICollectionOperation<T> {
    item: T;
    index: number;
}
export declare module CollectionEvents {
    const ADD: string;
    const CHANGE: string;
    const REMOVE: string;
    const REPLACE: string;
    const CLEAR: string;
    interface IChangeParams<T> {
    }
    interface IClearParams<T> {
    }
    interface IAddParams<T> {
        operations: ICollectionOperation<T>[];
    }
    interface IRemoveParams<T> {
        operations: ICollectionOperation<T>[];
        clear: boolean;
    }
    interface IReplaceParams<T> {
        source: T;
        replacement: T;
    }
}
export default class Collection<T> extends BaseObject {
    protected _data: T[];
    events: EventEmitter;
    constructor(data?: T[]);
    /**
     * Get length of Collection. (same as method count)
     *
     * @returns {number}
     */
    length: number;
    /**
     * Get count of Collection. (same as property length)
     *
     * @returns {number}
     */
    count(): number;
    /**
     * Add (push) item to Collection.
     *
     * @param item Item to be added.
     */
    add(item: T): T;
    /**
     * Add multiple (concat) items to Collection.
     *
     * @param items Items to be added.
     */
    addMany(items: T[]): T[];
    /**
     * Remove item from Collection.
     *
     * @param item Item to be removed.
     */
    remove(item: T): void;
    /**
     * Remove multiple items from Collection.
     *
     * @param items Items to be removed.
     */
    removeMany(items: T[]): void;
    /**
     * Remove items using properties.
     *
     * @param properties    Object containing key-value pairs.
     */
    removeWhere(properties: any): void;
    /**
     * Replace an item with another item in Collection
     *
     * TODO: Discussion - Should there be a recursiveReplaceItem() that will replace duplicates?
     *
     * @param source    The item that gets replaced inside the Collection.
     * @param replacement The item that replaces the source item.
     * @returns {any}
     */
    replaceItem(source: T, replacement: T): T;
    /**
     * Clears the Collection.
     */
    clear(): void;
    /**
     * Iterates over all item in Collection, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    each(iterator: _.ListIterator<T, void>): void;
    /**
     * The pluck method retrieves all of the collection values for a given key
     *
     * @param propertyName
     * @returns {Collection<string>|Collection}
     */
    pluck<S>(propertyName: string): Collection<S>;
    /**
     * Check whether the Collection is empty.
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Filter items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    filter(iterator?: _.ListIterator<T, boolean>): T[];
    /**
     * Get the index of an item in collection.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    indexOf(item: T): number;
    /**
     * Find item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    find(iterator?: _.ListIterator<T, boolean>): T;
    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * Collection.where({author: "Shakespeare", year: 1611});
     *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
     * ````
     * @param properties Object containing key-value pairs.
     * @returns {T[]}
     */
    where(properties: {}): T[];
    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    whereFirst(properties: {}): T;
    /**
     * Check if Collection contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    contains(item: T): boolean;
    /**
     * Map values using an iterator returning a new instance
     * @param iterator
     * @param context
     * @returns {Collection<S>|Collection} returns new Collection
     */
    map<S>(iterator: _.ListIterator<T, any>, context?: any): Collection<S>;
    /**
     * Tranform values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection|Collection}
     */
    transform(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
    /**
     * Reject values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection} Returns new Collection
     */
    reject(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    toArray(): T[];
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    all(): T[];
    clone(): Collection<T>;
}
