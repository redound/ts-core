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
    constructor(data?: T[], sortPredicate?: any, direction?: SortedListDirection);
    length: number;
    count(): number;
    add(item: T): void;
    protected sortedIndex(item: T): number;
    addMany(items?: T[]): void;
    remove(item: T): void;
    removeMany(items: T[]): void;
    removeWhere(properties: any): void;
    replaceItem(source: T, replacement: T): T;
    clear(): void;
    each(iterator: _.ListIterator<T, void>): void;
    map<S>(iterator: _.ListIterator<T, any>, context?: any): SortedList<S>;
    pluck(propertyName: string): any[];
    isEmpty(): boolean;
    first(): T;
    last(): T;
    get(index: number): T;
    indexOf(item: T): number;
    find(iterator?: _.ListIterator<T, boolean>): T[];
    findFirst(iterator?: _.ListIterator<T, boolean>): T;
    where(properties: {}): T[];
    whereFirst(properties: {}): T;
    contains(item: T): boolean;
    toArray(): T[];
    all(): T[];
    clone(): SortedList<T>;
    sort(): void;
    setSortPredicate(predicate: any, direction?: SortedListDirection): void;
    getSortPredicate(): any;
    isAscending(): boolean;
    isDescending(): boolean;
    getSortDirection(): SortedListDirection;
}
