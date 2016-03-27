/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export interface ListOperationInterface<T> {
    item: T;
    index: number;
}
export declare module ListEvents {
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
        operations: ListOperationInterface<T>[];
        clear: boolean;
    }
    interface IRemoveParams<T> {
        operations: ListOperationInterface<T>[];
    }
    interface IReplaceParams<T> {
        source: T;
        replacement: T;
    }
}
export default class List<T> extends BaseObject {
    protected _data: T[];
    events: EventEmitter;
    constructor(data?: T[]);
    /**
     * Get length of List. (same as method count)
     *
     * @returns {number}
     */
    length: number;
    /**
     * Get count of List. (same as property length)
     *
     * @returns {number}
     */
    count(): number;
    /**
     * Add (push) item to List.
     *
     * @param item Item to be added.
     */
    add(item: T): void;
    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
    addMany(items?: T[]): void;
    /**
     * Prepend item to list.
     *
     * @param item  Item to be inserted.
     */
    prepend(item: T): void;
    /**
     * Prepend multiple items to list.
     *
     * @param items Items to be inserted
     */
    prependMany(items: T[]): void;
    /**
     * Insert an item at a certain index.
     *
     * @param item  Item to be inserted.
     * @param index Index to insert item at.
     */
    insert(item: T, index: number): void;
    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
    remove(item: T): void;
    /**
     * Remove item at index
     * @param index
     */
    removeAt(index: number): void;
    /**
     * Remove multiple items from List.
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
     * Replace an item with another item.
     *
     * @param source        The item that gets replaced inside the list.
     * @param replacement   The item that replaces the source item.
     * @returns {T}
     */
    replaceItem(source: T, replacement: T): T;
    /**
     * Replace an item at a certain index.
     *
     * @param index         Index of the item that gets replaced.
     * @param replacement   The item the replaces the source item.
     * @returns {any}
     */
    replace(index: number, replacement: T): T;
    /**
     * Clears the List.
     */
    clear(): void;
    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    each(iterator: _.ListIterator<T, void>): void;
    map<S>(iterator: _.ListIterator<T, any>, context?: any): List<S>;
    /**
     * The pluck method retrieves all of the list values for a given key
     *
     * @param propertyName
     * @returns {List<S>|List}
     */
    pluck<S>(propertyName: string): List<S>;
    /**
     * Check whether the List is empty.
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Get the first item from list.
     *
     * @returns {T}
     */
    first(): T;
    /**
     * Get the last item from list.
     * @returns {T}
     */
    last(): T;
    /**
     * Get an item at a specified index in list.
     *
     * @param index Index of the item to be returned.
     * @returns {T}
     */
    get(index: number): T;
    /**
     * Get the index of an item in list.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    indexOf(item: T): number;
    /**
     * Sort list.
     *
     * @returns {void}
     */
    sort(sortPredicate: any): void;
    /**
     * Find items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    find(iterator?: _.ListIterator<T, boolean>): T[];
    /**
     * Find first item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    findFirst(iterator?: _.ListIterator<T, boolean>): T;
    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * list.where({author: "Shakespeare", year: 1611});
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
     * Check if List contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    contains(item: T): boolean;
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
    clone(): List<T>;
}
