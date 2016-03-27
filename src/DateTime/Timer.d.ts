/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export interface TimerTickCallbackInterface {
    (tickCount: number, elapsedTime: number): void;
}
export declare module Events {
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
export default class Timer extends BaseObject {
    timeout: number;
    tickCallback: TimerTickCallbackInterface;
    repeats: boolean;
    events: EventEmitter;
    tickCount: number;
    elapsedTime: number;
    startDate: Date;
    isStarted: boolean;
    private _isStarted;
    private _tickCount;
    private _startDate;
    private _internalTimer;
    private _internalTimerIsInterval;
    /**
     * Constructor function
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats Whether the timer should repeat.
     */
    constructor(timeout: number, tickCallback?: TimerTickCallbackInterface, repeats?: boolean);
    /**
     * Start timer if not already started.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Resume timer if not running.
     *
     * @returns {void}
     */
    resume(): void;
    /**
     * Pause timer if it's running.
     *
     * @returns {void}
     */
    pause(): void;
    /**
     * Restart the timer.
     *
     * @returns {void}
     */
    restart(): void;
    /**
     * Stop the timer.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * Reset the timer. The timer will pause.
     *
     * @returns {void}
     */
    reset(): void;
    /**
     * Start the timer.
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats   Whether the timer should repeat.
     * @returns {Timer}
     */
    static start(timeout: number, tickCallback?: TimerTickCallbackInterface, repeats?: boolean): Timer;
    /**
     * Increases tick count.
     * Calls tick callback.
     *
     * @private
     */
    private _timerTick();
}
