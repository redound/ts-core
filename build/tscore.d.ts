/// <reference path="../typings/tsd.d.ts" />
declare module TSCore.Events {
    class Event<T> {
        topic: string;
        private _params;
        caller: any;
        isStopped: boolean;
        constructor(topic: string, _params: T, caller: any);
        params: T;
        stop(): void;
    }
}
declare module TSCore.Events {
    interface IEventEmitterCallback {
        (event: Event<any>): any;
    }
    class EventEmitter {
        private _eventCallbacks;
        constructor();
        on(topics: string, callback: IEventEmitterCallback, context?: any, once?: boolean): void;
        once(topics: string, callback: IEventEmitterCallback, context?: any): void;
        off(topics: string, callback?: Function, context?: any): void;
        trigger(topic: string, params?: {}, caller?: any): void;
        resetEvents(): void;
    }
}
declare module TSCore.Data.Collection {
    module SetEvents {
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
            items: T[];
        }
        interface IRemoveParams<T> {
            items: T[];
        }
        interface IReplaceParams<T> {
            source: T;
            replacement: T;
        }
    }
    class Set<T> extends TSCore.Events.EventEmitter {
        protected _data: T[];
        constructor(data?: T[]);
        length: number;
        add(item: T): void;
        addMany(items: T[]): void;
        remove(item: T): void;
        removeMany(items: T[]): void;
        removeWhere(properties: {}): void;
        replaceItem(source: T, replacement: T): T;
        clear(): void;
        each(iterator: _.ListIterator<T, void>): void;
        pluck(propertyName: string): any[];
        count(): number;
        isEmpty(): boolean;
        populate(items: any): void;
        find(iterator: _.ListIterator<T, boolean>): T[];
        findFirst(iterator: _.ListIterator<T, boolean>): T;
        where(properties: {}): T[];
        whereFirst(properties: {}): T;
        contains(item: T): boolean;
        toArray(): T[];
        protected _createItem(itemData: any): T;
    }
}
declare module TSCore.Data.Collection {
    interface IDictionaryData {
        [key: string]: IKeyValuePair;
    }
    interface IDictionaryIterator<K, V> {
        (key: K, value: V): any;
    }
    module DictionaryEvents {
        const ADD: string;
        const CHANGE: string;
        const REMOVE: string;
        const CLEAR: string;
        interface IChangeParams {
        }
        interface IClearParams {
        }
        interface IAddParams<K, V> {
            key: K;
            value: V;
        }
        interface IRemoveParams<K, V> {
            key: K;
            value: V;
        }
    }
    class Dictionary<K, V> extends TSCore.Events.EventEmitter {
        private static _OBJECT_UNIQUE_ID_KEY;
        private static _OBJECT_UNIQUE_ID_COUNTER;
        protected _data: IDictionaryData;
        protected _itemCount: number;
        constructor(data?: IDictionaryData);
        get(key: K): V;
        set(key: K, value: V): void;
        remove(key: K): V;
        contains(key: K): boolean;
        containsValue(value: V): boolean;
        each(iterator: IDictionaryIterator<K, V>): void;
        values(): K[];
        keys(): K[];
        count(): number;
        isEmpty(): boolean;
        clear(): void;
        protected _getPair(key: K): IKeyValuePair;
        protected _getKeyString(key: K): string;
        protected _assignUniqueID(object: Object): void;
    }
}
declare module TSCore {
    interface IDIInjectable {
        getDI(): DI;
        setDI(di: DI): void;
    }
    interface IDIServiceFactory {
        (di: DI): any;
    }
    class DI {
        private _services;
        private _cache;
        constructor();
        get(key: string, shared?: boolean): any;
        getShared(key: string): any;
        set(key: string, service: IDIServiceFactory | any, shared?: boolean): void;
        setShared(key: string, service: IDIServiceFactory | any): void;
        reset(): void;
        private _instantiate(service);
    }
}
declare module TSCore.Data.Collection {
    module CollectionEvents {
        const ADD: string;
        const CHANGE: string;
        const REMOVE: string;
        const REPLACE: string;
        const CLEAR: string;
        interface IChangeParams<T> extends SetEvents.IChangeParams<T> {
        }
        interface IClearParams<T> extends SetEvents.IClearParams<T> {
        }
        interface IAddParams<T> extends SetEvents.IAddParams<T> {
        }
        interface IRemoveParams<T> extends SetEvents.IRemoveParams<T> {
        }
        interface IReplaceParams<T> extends SetEvents.IReplaceParams<T> {
        }
    }
    class Collection<T> extends Set<T> {
        length: number;
        protected _data: T[];
        prepend(item: T): void;
        prependMany(items: T[]): void;
        insert(item: T, index: number): void;
        replaceItem(source: T, replacement: T): T;
        replace(index: number, replacement: T): T;
        first(): T;
        last(): T;
        get(index: number): T;
        indexOf(item: T): number;
    }
}
declare module TSCore.Data.Collection {
    class Grid<T> {
    }
}
declare module TSCore.Data.Collection {
    class Queue<T> {
    }
}
declare module TSCore.Data.Collection {
    module SortedCollectionEvents {
        const ADD: string;
        const CHANGE: string;
        const REMOVE: string;
        const REPLACE: string;
        const CLEAR: string;
        const SORT: string;
        interface IChangeParams<T> extends SetEvents.IChangeParams<T> {
        }
        interface IClearParams<T> extends SetEvents.IClearParams<T> {
        }
        interface IAddParams<T> extends SetEvents.IAddParams<T> {
        }
        interface IRemoveParams<T> extends SetEvents.IRemoveParams<T> {
        }
        interface IReplaceParams<T> extends SetEvents.IReplaceParams<T> {
        }
        interface ISortParams<T> {
        }
    }
    class SortedCollection<T> extends Set<T> {
        protected _sortPredicate: any;
        sortPredicate: any;
        constructor(data: T[], sortPredicate: any);
        add(item: T): void;
        addMany(items: T[]): void;
        remove(item: T): void;
        removeMany(items: T[]): void;
        replaceItem(source: T, replacement: T): T;
        first(): T;
        last(): T;
        get(index: number): T;
        indexOf(item: T): number;
        sort(): void;
    }
}
declare module TSCore.Data {
    class Config {
    }
}
declare module TSCore.Data.Model {
    class Model {
        defaults: {};
        constructor(attrs: any);
    }
}
declare module TSCore.DateTime {
    class DateFormatter {
    }
}
declare module TSCore.DateTime {
    class DateTime {
    }
}
declare module TSCore.DateTime {
    interface ITimerTickCallback {
        (tickCount: number, elapsedTime: number): void;
    }
    class Timer {
        timeout: number;
        tickCallback: ITimerTickCallback;
        repeats: boolean;
        tickCount: number;
        elapsedTime: number;
        startDate: Date;
        isStarted: boolean;
        private _isStarted;
        private _tickCount;
        private _startDate;
        private _internalTimer;
        private _internalTimerIsInterval;
        constructor(timeout: number, tickCallback?: ITimerTickCallback, repeats?: boolean);
        start(): void;
        resume(): void;
        pause(): void;
        restart(): void;
        stop(): void;
        reset(): void;
        static start(timeout: number, tickCallback?: ITimerTickCallback, repeats?: boolean): Timer;
        private _timerTick();
    }
}
declare module TSCore.Exception {
    class ArgumentException {
    }
}
declare module TSCore.Exception {
    class Exception {
        message: string;
        code: number;
        data: {};
        name: string;
        constructor(message: string, code?: number, data?: {});
        toString(): string;
    }
}
declare module TSCore.Geometry {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        translate(x: number, y: number): void;
    }
}
declare module TSCore.Geometry {
    class Rect {
        origin: Point;
        size: Size;
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        center(): Point;
        topLeft(): Point;
        bottomLeft(): Point;
        topRight(): Point;
        bottomRight(): Point;
        halfWidth(): number;
        halfHeight(): number;
        containsPoint(point: Point): boolean;
        containsRect(rect: Rect): boolean;
        intersectsRect(rect: Rect): boolean;
        inset(top: number, right: number, bottom: number, left: number): void;
        insetCenter(horizontal: number, vertical: number): void;
        expand(horizontal: number, vertical: number): void;
        reduce(horizontal: number, vertical: number): void;
    }
}
declare module TSCore.Geometry {
    class Size {
        width: number;
        height: number;
        constructor(width?: number, height?: number);
        halfWidth(): number;
        halfHeight(): number;
    }
}
declare module TSCore {
    class Logger {
        constructor();
    }
}
declare module TSCore {
    interface IKeyValuePair {
        key: any;
        value: any;
    }
}
declare module TSCore.Text {
    class Format {
        private static HtmlEntityMap;
        static escapeHtml(input: string): string;
        static truncate(input: string, maxLength: number, suffix?: string): string;
        static concatenate(parts: any[], seperator?: string, lastSeparator?: string): string;
        static zeroPad(input: string, width: number, zero?: string): string;
        static ucFirst(input: string): string;
    }
}
declare module TSCore.Text {
    class Language {
    }
}
declare module TSCore.Text {
    class Random {
    }
}
declare module TSCore.Text {
    class URL {
        private _absoluteString;
        private _absoluteUrl;
        private _basePath;
        private _fragment;
        private _lastPathComponent;
        private _parameterString;
        private _password;
        private _path;
        private _pathComponents;
        private _pathExtension;
        private _port;
        private _query;
        private _relativePath;
        private _relativeString;
        private _resourceSpecifier;
        private _scheme;
        private _standardizedUrl;
        private _user;
        constructor(path: any);
        path: string;
        host: string;
        basePath: string;
        relativePath: string;
    }
}
