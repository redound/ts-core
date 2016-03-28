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
    length: number;
    count(): number;
    add(item: T): T;
    addMany(items: T[]): T[];
    remove(item: T): void;
    removeMany(items: T[]): void;
    removeWhere(properties: any): void;
    replaceItem(source: T, replacement: T): T;
    clear(): void;
    each(iterator: _.ListIterator<T, void>): void;
    pluck<S>(propertyName: string): Collection<S>;
    isEmpty(): boolean;
    filter(iterator?: _.ListIterator<T, boolean>): T[];
    indexOf(item: T): number;
    find(iterator?: _.ListIterator<T, boolean>): T;
    where(properties: {}): T[];
    whereFirst(properties: {}): T;
    contains(item: T): boolean;
    map<S>(iterator: _.ListIterator<T, any>, context?: any): Collection<S>;
    transform(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
    reject(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
    toArray(): T[];
    all(): T[];
    clone(): Collection<T>;
}
