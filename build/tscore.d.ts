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
        on(topics: string, callback: IEventEmitterCallback, context?: any, once?: boolean): TSCore.Events.EventEmitter;
        once(topics: string, callback: IEventEmitterCallback, context?: any): TSCore.Events.EventEmitter;
        off(topics: string, callback?: Function, context?: any): TSCore.Events.EventEmitter;
        trigger(topic: string, params?: {}, caller?: any): TSCore.Events.EventEmitter;
        reset(): TSCore.Events.EventEmitter;
    }
}
declare module TSCore.Auth {
    interface IIdentity {
    }
    interface IAttemptError {
        message: string;
    }
    interface ILoginAttemptError extends IAttemptError {
    }
    interface ILogoutAttemptError extends IAttemptError {
    }
    interface ILoginAttempt {
        (error: ILoginAttemptError, identity: IIdentity): any;
    }
    interface ILogoutAttempt {
        (error?: ILogoutAttemptError): any;
    }
    class Manager {
        protected _authMethods: TSCore.Data.Dictionary<any, Method>;
        protected sessions: TSCore.Data.Dictionary<any, Session>;
        events: TSCore.Events.EventEmitter;
        login(method: any, credentials: {}, done?: ILoginAttempt): void;
        private _setSessionForMethod(method, identity);
        logout(method: any, done?: ILogoutAttempt): void;
        addMethod(method: any, authMethod: Method): TSCore.Auth.Manager;
        removeMethod(method: any): TSCore.Auth.Manager;
        hasSessions(): boolean;
    }
    module Manager.Events {
        const LOGIN_ATTEMPT_FAIL: string;
        const LOGIN_ATTEMPT_SUCCESS: string;
        const LOGIN: string;
        const LOGOUT: string;
        interface ILoginAttemptFailParams<T> {
            credentials: T;
            method: string;
        }
        interface ILoginAttemptSuccessParams<T> {
            credentials: T;
            method: string;
            session: Session;
        }
        interface ILoginParams<T> {
            method: string;
            session: Session;
        }
        interface ILogoutParams<T> {
            method: string;
        }
    }
}
declare module TSCore.Auth {
    class Method {
        static name: string;
        login(credentials: any, done: ILoginAttempt): void;
        logout(session: TSCore.Auth.Session, done: ILogoutAttempt): void;
    }
}
declare module TSCore.Auth {
    class Session {
        protected _method: string;
        protected _identity: IIdentity;
        constructor(_method?: string, _identity?: IIdentity);
        getIdentity(): TSCore.Auth.IIdentity;
        setIdentity(identity: IIdentity): TSCore.Auth.Session;
        getMethod(): string;
        setMethod(method: string): TSCore.Auth.Session;
    }
}
declare module TSCore {
    class Bootstrap {
        init(): void;
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
    interface IDictionaryData {
        [key: string]: IKeyValuePair;
    }
    interface IDictionaryIterator<K, V> {
        (key: K, value: V): any;
    }
    class Dictionary<K, V> extends TSCore.Events.EventEmitter {
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
        protected _getPair(key: K): IKeyValuePair;
        protected _getKeyString(key: K): string;
        protected _assignUniqueID(object: Object): void;
    }
    module Dictionary.Events {
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
        setShared(key: string, service: IDIServiceFactory | any): TSCore.DI;
        reset(): TSCore.DI;
        private _instantiate(service);
    }
}
declare module TSCore.Data {
    class Collection<T> {
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
        pluck(propertyName: string): any[];
        isEmpty(): boolean;
        find(iterator?: _.ListIterator<T, boolean>): T[];
        findFirst(iterator?: _.ListIterator<T, boolean>): T;
        where(properties: {}): T[];
        whereFirst(properties: {}): T;
        contains(item: T): boolean;
        toArray(): T[];
    }
    module Collection.Events {
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
}
declare module TSCore.Data {
    class List<T> {
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
        removeMany(items: T[]): void;
        removeWhere(properties: any): void;
        replaceItem(source: T, replacement: T): T;
        replace(index: number, replacement: T): T;
        clear(): void;
        each(iterator: _.ListIterator<T, void>): void;
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
    }
    module List.Events {
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
}
declare module TSCore.Data {
    interface IModelInterface {
        new (data: {}): Model;
    }
    class Model {
        protected _defaults: {};
        protected _whitelist: string[];
        constructor(data?: {});
        protected whitelist(): string[];
        protected defaults(): {};
        assign(data?: any): Model;
        toObject(): {};
    }
}
declare module TSCore.Data {
    class ModelCollection<T extends Model> extends Collection<T> {
        protected _primaryKey: string;
        protected _modelClass: IModelInterface;
        constructor(modelClass: IModelInterface, primaryKey?: string, data?: T[]);
        addManyData(data: {}[]): T[];
        addData(data: {}): T;
        contains(item: T): boolean;
        toArray(): any[];
        protected _instantiateModel(data: {}): T;
    }
}
declare module TSCore.Data {
    class ModelDictionary<K, V extends Model> extends Dictionary<K, V> {
        protected _primaryKey: string;
        protected _modelClass: IModelInterface;
        constructor(modelClass: IModelInterface, primaryKey?: string, data?: IDictionaryData);
        addManyData(data: {}[]): V[];
        addData(data: {}): V;
        toArray(): any[];
        toObject(): {};
        protected _instantiateModel(data: {}): V;
    }
}
declare module TSCore.Data {
    class SortedList<T> {
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
        sort(): void;
    }
    module SortedList.Events {
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
}
declare module TSCore.Data {
    interface IRemoteStorage {
        getItem(key: any): any;
        setItem(key: string, value: any): void;
        removeItem(key: string): void;
        clear(): void;
    }
    class Store extends TSCore.Data.Dictionary<string, any> {
        protected _storage: IRemoteStorage;
        constructor(_storage: IRemoteStorage, data?: IDictionaryData);
        load(): void;
        get(key: string): any;
        set(key: string, value: any): void;
        remove(key: string): void;
        clear(): void;
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
        inset(top: number, right: number, bottom: number, left: number): TSCore.Geometry.Rect;
        insetCenter(horizontal: number, vertical: number): TSCore.Geometry.Rect;
        expand(horizontal: number, vertical: number): TSCore.Geometry.Rect;
        reduce(horizontal: number, vertical: number): TSCore.Geometry.Rect;
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
declare module TSCore.Text {
    class Language {
    }
}
declare module TSCore.Logger {
    interface IStream {
        level: LogLevel;
        exec(options: ILogOptions): any;
    }
}
declare module TSCore {
    module Logger {
        enum LogLevel {
            TRACE = 0,
            DEBUG = 1,
            INFO = 2,
            WARN = 3,
            ERROR = 4,
            FATAL = 5,
        }
        interface IExecOptions {
            level: LogLevel;
            args: any[];
        }
        interface ILogOptions {
            level: LogLevel;
            args: any[];
            time: number;
        }
        class Logger {
            private _streams;
            constructor();
            setStream(key: string, logger: TSCore.Logger.IStream): void;
            unsetStream(key: string): void;
            trace(...args: any[]): void;
            debug(...args: any[]): void;
            info(...args: any[]): void;
            warn(...args: any[]): void;
            error(...args: any[]): void;
            fatal(...args: any[]): void;
            private _exec(options);
        }
    }
}
declare module TSCore.Logger.Stream {
    interface IConsole {
        debug(): any;
        log(): any;
        info(): any;
        warn(): any;
        error(): any;
    }
    class Console implements TSCore.Logger.IStream {
        private _console;
        level: TSCore.Logger.LogLevel;
        constructor(_console: IConsole);
        exec(options: TSCore.Logger.IExecOptions): void;
    }
}
declare module TSCore.Logger.Stream {
    class Toastr implements TSCore.Logger.IStream {
        level: TSCore.Logger.LogLevel;
        exec(): void;
    }
}
declare module TSCore {
    interface IKeyValuePair {
        key: any;
        value: any;
    }
}
declare module TSCore.Utils {
    class Base64 {
        private static keyStr;
        constructor();
        encode(input: any): string;
        decode(input: any): string;
    }
}
declare module TSCore.Utils {
    class Random {
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
    class Text {
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
