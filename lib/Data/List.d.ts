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
    length: number;
    count(): number;
    add(item: T): void;
    addMany(items?: T[]): void;
    prepend(item: T): void;
    prependMany(items: T[]): void;
    insert(item: T, index: number): void;
    remove(item: T): void;
    removeAt(index: number): void;
    removeMany(items: T[]): void;
    removeWhere(properties: any): void;
    replaceItem(source: T, replacement: T): T;
    replace(index: number, replacement: T): T;
    clear(): void;
    each(iterator: _.ListIterator<T, void>): void;
    map<S>(iterator: _.ListIterator<T, any>, context?: any): List<S>;
    pluck<S>(propertyName: string): List<S>;
    isEmpty(): boolean;
    first(): T;
    last(): T;
    get(index: number): T;
    indexOf(item: T): number;
    sort(sortPredicate: any): void;
    find(iterator?: _.ListIterator<T, boolean>): T[];
    findFirst(iterator?: _.ListIterator<T, boolean>): T;
    where(properties: {}): T[];
    whereFirst(properties: {}): T;
    contains(item: T): boolean;
    toArray(): T[];
    all(): T[];
    clone(): List<T>;
}
