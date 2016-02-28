declare module TSCore {
    class BaseObject {
        static: any;
    }
}
declare module TSCore.Events {
    class Event<T> extends TSCore.BaseObject {
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
    class EventEmitter extends TSCore.BaseObject {
        private _eventCallbacks;
        constructor();
        on(topics: string, callback: IEventEmitterCallback, context?: any, once?: boolean): TSCore.Events.EventEmitter;
        once(topics: string, callback: IEventEmitterCallback, context?: any): TSCore.Events.EventEmitter;
        off(topics: string, callback?: Function, context?: any): TSCore.Events.EventEmitter;
        trigger<T>(topic: string, params?: T, caller?: any): TSCore.Events.EventEmitter;
        reset(): TSCore.Events.EventEmitter;
    }
}
declare module TSCore {
    class Config extends Events.EventEmitter {
        private _cache;
        private _data;
        constructor(data?: any);
        get(key?: string): any;
        set(key: string, value: any): TSCore.Config;
        load(value: any): TSCore.Config;
        has(key: string): boolean;
        clear(key?: string): TSCore.Config;
    }
}
declare module TSCore.Data {
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
}
declare module TSCore.Data {
    interface IDictionaryData {
        [key: string]: IDictionaryKeyValuePair;
    }
    interface IDictionaryIterator<K, V> {
        (key: K, value: V): any;
    }
    interface IDictionaryKeyValuePair {
        key: any;
        originalKey: any;
        value: any;
    }
    class Dictionary<K, V> extends TSCore.BaseObject {
        private static _OBJECT_UNIQUE_ID_KEY;
        private static _OBJECT_UNIQUE_ID_COUNTER;
        protected _data: IDictionaryData;
        protected _itemCount: number;
        events: TSCore.Events.EventEmitter;
        constructor(data?: IDictionaryData);
        get(key: K): V;
        set(key: K, value: V): void;
        remove(key: K): V;
        contains(key: K): boolean;
        containsValue(value: V): boolean;
        each(iterator: IDictionaryIterator<K, V>): void;
        values(): V[];
        keys(): K[];
        count(): number;
        isEmpty(): boolean;
        clear(): void;
        toObject(): {};
        toArray(): V[];
        clone(): Dictionary<K, V>;
        protected _getPair(key: K): IDictionaryKeyValuePair;
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
    class DI extends TSCore.BaseObject {
        private _services;
        private _cache;
        constructor();
        get(key: string, shared?: boolean): any;
        getShared(key: string): any;
        set(key: string, service: IDIServiceFactory | any, shared?: boolean): void;
        setShared(key: string, service: IDIServiceFactory | any): TSCore.DI;
        reset(): TSCore.DI;
        private _instantiate(service);
    }
}
declare module TSCore.Data {
    interface ICollectionOperation<T> {
        item: T;
        index: number;
    }
}
declare module TSCore.Data {
    module CollectionEvents {
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
}
declare module TSCore.Data {
    class Collection<T> extends TSCore.BaseObject {
        protected _data: T[];
        events: TSCore.Events.EventEmitter;
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
        pluck(propertyName: string): TSCore.Data.Collection<string>;
        isEmpty(): boolean;
        filter(iterator?: _.ListIterator<T, boolean>): T[];
        find(iterator?: _.ListIterator<T, boolean>): T;
        where(properties: {}): T[];
        whereFirst(properties: {}): T;
        contains(item: T): boolean;
        map<S>(iterator: _.ListIterator<T, any>, context?: any): Collection<S>;
        transform(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
        reject(iterator: _.ListIterator<T, any>, context?: any): Collection<T>;
        toArray(): T[];
        clone(): Collection<T>;
    }
}
declare module TSCore.Data {
    interface IListOperation<T> {
        item: T;
        index: number;
    }
}
declare module TSCore.Data {
    module ListEvents {
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
            operations: IListOperation<T>[];
            clear: boolean;
        }
        interface IRemoveParams<T> {
            operations: IListOperation<T>[];
        }
        interface IReplaceParams<T> {
            source: T;
            replacement: T;
        }
    }
}
declare module TSCore.Data {
    class List<T> extends TSCore.BaseObject {
        protected _data: T[];
        events: TSCore.Events.EventEmitter;
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
        pluck(propertyName: string): any[];
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
        clone(): List<T>;
    }
}
declare module TSCore.Data {
    class DynamicList<T> extends List<T> {
        setRange(start: number, items: T[]): void;
        containsRange(start: number, length: number): boolean;
        getRange(start: number, length: number): T[];
    }
}
declare module TSCore.Data {
    interface ISortedListOperation<T> {
        item: T;
        index: number;
    }
}
declare module TSCore.Data {
    interface IModel {
        new (data?: any): Model;
        primaryKey(): any;
        whitelist(): string[];
        defaults(): any;
    }
    class Model extends TSCore.BaseObject {
        events: TSCore.Events.EventEmitter;
        constructor(data?: any);
        set(key: string, value: any): void;
        get(key: string): any;
        static primaryKey(): string;
        static whitelist(): string[];
        static defaults(): any;
        getId(): any;
        assign(data?: any): Model;
        assignAll(data?: any): Model;
        merge(model: Model): void;
        equals(data: any): boolean;
        getDataKeys(): string[];
        toObject(recursive?: boolean): {};
    }
}
declare module TSCore.Data {
    class ModelCollection<T extends Model> extends Collection<T> {
        protected _modelClass: IModel;
        constructor(modelClass: IModel, data?: T[]);
        addManyData(data: {}[]): T[];
        addData(data: {}): T;
        contains(item: T): boolean;
        toArray(): any[];
        protected _instantiateModel(data: {}): T;
    }
}
declare module TSCore.Data {
    class ModelDictionary<K, V extends Model> extends Dictionary<K, V> {
        protected _modelClass: IModel;
        constructor(modelClass: IModel, data?: IDictionaryData);
        addManyData(data: {}[]): V[];
        addData(data: {}): V;
        toArray(): any[];
        toObject(): {};
        protected _instantiateModel(data: {}): V;
    }
}
declare module TSCore.Data {
    class ModelList<T extends Model> extends List<T> {
    }
}
declare module TSCore.Data {
    module SortedListEvents {
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
}
declare module TSCore.Data {
    class SortedList<T> extends TSCore.BaseObject {
        protected _sortPredicate: any;
        protected _data: T[];
        events: TSCore.Events.EventEmitter;
        sortPredicate: any;
        constructor(data: T[], sortPredicate: any);
        length: number;
        count(): number;
        add(item: T): void;
        addMany(items?: T[]): void;
        remove(item: T): void;
        removeMany(items: T[]): void;
        removeWhere(properties: any): void;
        replaceItem(source: T, replacement: T): T;
        clear(): void;
        each(iterator: _.ListIterator<T, void>): void;
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
        clone(): SortedList<T>;
        sort(): void;
    }
}
declare module TSCore.DateTime {
    interface ITimerTickCallback {
        (tickCount: number, elapsedTime: number): void;
    }
    class Timer extends TSCore.BaseObject {
        timeout: number;
        tickCallback: ITimerTickCallback;
        repeats: boolean;
        events: TSCore.Events.EventEmitter;
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
    module Timer.Events {
        const START: string;
        const PAUSE: string;
        const RESUME: string;
        const STOP: string;
        const TICK: string;
        interface IStartParams {
            startDate: Date;
        }
        interface IPauseParams {
            startDate: Date;
            tickCount: number;
            elapsedTime: number;
        }
        interface IResumeParams {
            startDate: Date;
            tickCount: number;
            elapsedTime: number;
        }
        interface IStopParams {
            startDate: Date;
            tickCount: number;
            elapsedTime: number;
        }
        interface ITickParams {
            startDate: Date;
            tickCount: number;
            elapsedTime: number;
        }
    }
}
declare module TSCore.Exception {
    class ArgumentException extends TSCore.BaseObject {
    }
}
declare module TSCore.Exception {
    class Exception extends TSCore.BaseObject {
        message: string;
        code: number;
        data: {};
        name: string;
        constructor(message: string, code?: number, data?: {});
        toString(): string;
    }
}
declare module TSCore.Geometry {
    class Point extends TSCore.BaseObject {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        translate(x: number, y: number): void;
    }
}
declare module TSCore.Geometry {
    class Rect extends TSCore.BaseObject {
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
        inset(top: number, right: number, bottom: number, left: number): TSCore.Geometry.Rect;
        insetCenter(horizontal: number, vertical: number): TSCore.Geometry.Rect;
        expand(horizontal: number, vertical: number): TSCore.Geometry.Rect;
        reduce(horizontal: number, vertical: number): TSCore.Geometry.Rect;
    }
}
declare module TSCore.Geometry {
    class Size extends TSCore.BaseObject {
        width: number;
        height: number;
        constructor(width?: number, height?: number);
        halfWidth(): number;
        halfHeight(): number;
    }
}
declare module TSCore.Logger {
    interface IStream extends TSCore.BaseObject {
        exec(options: ILogOptions): any;
    }
}
declare module TSCore.Logger {
    enum LogLevel {
        LOG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3,
        FATAL = 4,
    }
    interface ILogOptions {
        level: LogLevel;
        tag: string;
        args: any[];
        time: number;
    }
    interface IStreamEntry {
        level: LogLevel;
        stream: TSCore.Logger.IStream;
    }
    class Logger extends TSCore.BaseObject {
        protected _streams: TSCore.Data.Dictionary<string, IStreamEntry>;
        protected _parent: Logger;
        protected _tag: string;
        constructor(parent?: Logger, tag?: string);
        child(tag: string): Logger;
        addStream(key: string, stream: TSCore.Logger.IStream, level?: LogLevel): void;
        removeStream(key: string): void;
        getStreams(): TSCore.Data.Dictionary<string, IStreamEntry>;
        log(...args: any[]): void;
        info(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        fatal(...args: any[]): void;
        private _exec(level, args);
    }
}
declare module TSCore.Logger.Stream {
    interface IConsole {
        log(): any;
        info(): any;
        warn(): any;
        error(): any;
    }
    class Console extends TSCore.BaseObject implements TSCore.Logger.IStream {
        private _console;
        colorsEnabled: boolean;
        constructor(_console: IConsole, colorsEnabled?: boolean);
        exec(options: TSCore.Logger.ILogOptions): void;
        protected _generateHex(input: string): string;
        protected _getIdealTextColor(bgColor: any): string;
    }
}
declare module TSCore {
    interface IKeyValuePair {
        key: any;
        value: any;
    }
}
declare module TSCore.Utils {
    class Base64 extends TSCore.BaseObject {
        private static keyStr;
        encode(input: any): string;
        decode(input: any): string;
    }
}
declare module TSCore.Utils {
    class Enum {
        static names(e: any): string[];
        static values(e: any): number[];
        static object(e: any): {
            name: string;
            value: number;
        }[];
    }
}
declare module TSCore.Utils {
    class Random extends TSCore.BaseObject {
        private static _uuidLut;
        private static uuidLut;
        static number(min: number, max: number): number;
        static uniqueNumber(): number;
        static bool(): boolean;
        static string(length?: number, characters?: string): string;
        static uuid(): string;
    }
}
declare module TSCore.Utils {
    class Text extends TSCore.BaseObject {
        private static HtmlEntityMap;
        static escapeHtml(input: string): string;
        static truncate(input: string, maxLength: number, suffix?: string): string;
        static concatenate(parts: any[], seperator?: string, lastSeparator?: string): string;
        static zeroPad(input: string, width: number, zero?: string): string;
        static ucFirst(input: string): string;
        static startsWith(source: string, search: string): boolean;
        static endsWith(source: string, search: string): boolean;
    }
}
declare module TSCore.Utils {
    class URL extends TSCore.BaseObject {
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
