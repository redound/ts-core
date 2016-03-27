/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
export interface IEventEmitterCallback {
    (event: Event<any>): any;
}
export declare class Event<T> extends BaseObject {
    topic: string;
    private _params;
    caller: any;
    isStopped: boolean;
    /**
     * Constructor function.
     *
     * @param topic Topic name of event.
     * @param _params Params that will be passed along event.
     * @param caller Context that trigger the original event.
     */
    constructor(topic: string, _params: T, caller: any);
    /**
     * Magic getter for params.
     *
     * @returns {T}
     */
    params: T;
    /**
     * Stop the event from being called.
     *
     * @returns {void}
     */
    stop(): void;
}
export default class EventEmitter extends BaseObject {
    private _eventCallbacks;
    /**
     * Constructor function
     *
     * @returns {EventEmitter}
     */
    constructor();
    /**
     * Subscribe to triggered events.
     * @param topics        Which topics to listen, separated by space
     * @param callback      Callback function to execute on trigger.
     * @param context       Context for the callback
     * @param once          Run the callback for emitted event exactly one
     * @returns             {EventEmitter}
     */
    on(topics: string, callback: IEventEmitterCallback, context?: any, once?: boolean): this;
    /**
     * Subscribe to emitted topics exactly once
     * @param topics        Which topics to listen, separated by space
     * @param callback      Callback function to execute on trigger.
     * @param context       Context for the callback
     * @returns             {EventEmitter}
     */
    once(topics: string, callback: IEventEmitterCallback, context?: any): this;
    /**
     * Unsubscribe from published topics.
     * @param topics        Which topics to stop listening, seperated by space
     * @param callback      Callback function executed on trigger.
     * @param context       Context for the callback
     * @returns             {EventEmitter}
     */
    off(topics: string, callback?: Function, context?: any): this;
    /**
     * Publish event for a topic.
     * TODO: Generic for param bag.
     * ````
     * var emitter = new TSCore.Event.EventEmitter();
     * emitter.trigger('topic', arg1, arg2);
     * ````
     * @param topic         Which topic to trigger.
     * @param args          Arguments to pass along event.
     * @returns             {EventEmitter}
     */
    trigger<T>(topic: string, params?: T, caller?: any): this;
    /**
     * Reset all subscriptions.
     *
     * @returns {EventEmitter}
     */
    reset(): this;
}
