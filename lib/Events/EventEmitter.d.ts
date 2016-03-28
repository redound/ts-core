import BaseObject from "../BaseObject";
export interface IEventEmitterCallback {
    (event: Event<any>): any;
}
export declare class Event<T> extends BaseObject {
    topic: string;
    private _params;
    caller: any;
    isStopped: boolean;
    constructor(topic: string, _params: T, caller: any);
    params: T;
    stop(): void;
}
export default class EventEmitter extends BaseObject {
    private _eventCallbacks;
    constructor();
    on(topics: string, callback: IEventEmitterCallback, context?: any, once?: boolean): this;
    once(topics: string, callback: IEventEmitterCallback, context?: any): this;
    off(topics: string, callback?: Function, context?: any): this;
    trigger<T>(topic: string, params?: T, caller?: any): this;
    reset(): this;
}
