/// <reference path="../src/tscore.d.ts" />
declare module TSCore.Data {
    class Collection<T> {
        private _data;
        constructor(data?: T[]);
        add(item: T): void;
        addAll(items: T[]): void;
        remove(item: T): void;
        removeAll(items: T[]): void;
        first(): T;
        last(): T;
        reset(): void;
        each(iterator: _.ListIterator<T, void>): void;
        pluck(propertyName: string): any[];
        count(): number;
        length: number;
        populate(items: any): void;
        find(iterator: _.ListIterator<T, boolean>): T;
        filter(iterator: _.ListIterator<T, boolean>): T[];
        where(properties: {}): T[];
        findWhere(properties: {}): T;
        toArray(): T[];
        protected createItem(itemData: any): T;
    }
}
declare module TSCore.Data {
    class Model {
        defaults: {};
        constructor(attrs: any);
    }
}
declare module TSCore.DateTime {
    interface TimerTickCallback {
        (tickCount: number, timeSinceStart: number): void;
    }
    class Timer {
        timeout: number;
        tickCallback: TimerTickCallback;
        repeats: boolean;
        tickCount: number;
        startDate: Date;
        isStarted: boolean;
        private _isStarted;
        private _tickCount;
        private _startDate;
        private _internalTimer;
        private _internalTimerIsInterval;
        constructor(timeout: number, tickCallback?: TimerTickCallback, repeats?: boolean);
        start(): void;
        resume(): void;
        pause(): void;
        restart(): void;
        stop(): void;
        reset(): void;
        static start(timeout: number, tickCallback?: TimerTickCallback, repeats?: boolean): Timer;
        private _timerTick();
    }
}
declare module TSCore {
}
