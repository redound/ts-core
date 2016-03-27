/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export interface ISortedListOperation<T> {
    item: T;
    index: number;
}
export declare module SortedListEvents {
    const ADD: string;
    const CHANGE: string;
    const REMOVE: string;
    const REPLACE: string;
    const CLEAR: string;
    const SORT: string;
    interface IChangeParams<T> {
    }
    interface IClearParams<T> {
    }
    interface ISortParams<T> {
    }
    interface IAddParams<T> {
        operations: ISortedListOperation<T>[];
    }
    interface IRemoveParams<T> {
        operations: ISortedListOperation<T>[];
        clear: boolean;
    }
    interface IReplaceParams<T> {
        source: T;
        replacement: T;
    }
}
export declare enum SortedListDirection {
    ASCENDING = 0,
    DESCENDING = 1,
}
export default class SortedList<T> extends BaseObject {
    protected _sortPredicate: any;
    protected _sortDirection: SortedListDirection;
    protected _data: T[];
    events: EventEmitter;
    /**
     * Constructor function
     * @param data Data to populate list of instance with.
     * @param sortPredicate Predicate to sort list to.
     */
    constructor(data?: T[], sortPredicate?: any, direction?: SortedListDirection);
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
    protected sortedIndex(item: T): number;
    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
    addMany(items?: T[]): void;
    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
    remove(item: T): void;
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
     * Clears the List.
     */
    clear(): void;
    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    each(iterator: _.ListIterator<T, void>): void;
    map<S>(iterator: _.ListIterator<T, any>, context?: any): SortedList<S>;
    /**
     * A convenient version of what is perhaps the most common use-case for map:
     * extracting a list of property values.
     *
     * @param propertyName Property name to pluck.
     * @returns {any[]}
     */
    pluck(propertyName: string): any[];
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
     * Convert List to array.
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
    clone(): SortedList<T>;
    /**
     * Resort list.
     *
     * @returns {void}
     */
    sort(): void;
    /** Set sortPredicate along with the sort direction
     *
     * @param predicate Predicate to set.
     * @param direction Direction to sort list to (ASC&DESC)
     */
    setSortPredicate(predicate: any, direction?: SortedListDirection): void;
    /**
     * Get the current sortPredicate
     * @returns {any}
     */
    getSortPredicate(): any;
    isAscending(): boolean;
    isDescending(): boolean;
    getSortDirection(): SortedListDirection;
}
