import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export interface TimerTickCallbackInterface {
    (tickCount:number, elapsedTime:number):void;
}

export module Events {

    export const START:string = "start";
    export const PAUSE:string = "pause";
    export const RESUME:string = "resume";
    export const STOP:string = "stop";
    export const TICK:string = "tick";

    export interface IStartParams {
        startDate:Date,
    }

    export interface IPauseParams {
        startDate:Date,
        tickCount:number,
        elapsedTime:number
    }

    export interface IResumeParams {
        startDate:Date,
        tickCount:number,
        elapsedTime:number
    }

    export interface IStopParams {
        startDate:Date,
        tickCount:number,
        elapsedTime:number
    }

    export interface ITickParams {
        startDate:Date,
        tickCount:number,
        elapsedTime:number
    }
}

export default class Timer extends BaseObject {

    public timeout:number;
    public tickCallback:TimerTickCallbackInterface;
    public repeats:boolean;

    public events:EventEmitter = new EventEmitter();

    public get tickCount():number {
        return this._tickCount
    }

    public get elapsedTime():number {

        if (!this._startDate) {
            return null;
        }

        return new Date().getTime() - this._startDate.getTime();
    }

    public get startDate():Date {
        return this._startDate
    }

    public get isStarted():boolean {
        return this._isStarted
    }


    private _isStarted:boolean;
    private _tickCount:number;
    private _startDate:Date;

    private _internalTimer:number;
    private _internalTimerIsInterval:boolean;

    /**
     * Constructor function
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats Whether the timer should repeat.
     */
    constructor(timeout:number, tickCallback:TimerTickCallbackInterface = null, repeats:boolean = false) {

        super();

        this.timeout = timeout;
        this.tickCallback = tickCallback;
        this.repeats = repeats;
    }

    /**
     * Start timer if not already started.
     *
     * @returns {void}
     */
    public start():void {

        if (this._isStarted) {
            return;
        }

        this._tickCount = 0;
        this._startDate = new Date();

        this.events.trigger(Events.START, {
            startDate: this._startDate
        });

        this.resume();
    }

    /**
     * Resume timer if not running.
     *
     * @returns {void}
     */
    public resume():void {

        if (this._isStarted) {
            return;
        }

        this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
        this._internalTimerIsInterval = this.repeats;

        this._isStarted = true;

        this.events.trigger(Events.RESUME, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    }

    /**
     * Pause timer if it's running.
     *
     * @returns {void}
     */
    public pause():void {

        if (!this._isStarted) {
            return;
        }

        (this._internalTimerIsInterval ? clearInterval : clearTimeout)(this._internalTimer);
        this._internalTimer = null;

        this._isStarted = false;

        this.events.trigger(Events.PAUSE, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    }

    /**
     * Restart the timer.
     *
     * @returns {void}
     */
    public restart() {

        this.stop();
        this.start();
    }

    /**
     * Stop the timer.
     *
     * @returns {void}
     */
    public stop() {

        var eventParams = {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        };

        this.reset();

        this.events.trigger(Events.STOP, eventParams);
    }

    /**
     * Reset the timer. The timer will pause.
     *
     * @returns {void}
     */
    public reset() {

        if (this._isStarted) {
            this.pause();
        }

        this._tickCount = 0;
        this._startDate = null;
    }

    /**
     * Start the timer.
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats   Whether the timer should repeat.
     * @returns {Timer}
     */
    public static start(timeout:number, tickCallback:TimerTickCallbackInterface = null, repeats:boolean = false):Timer {

        var timer = new this(timeout, tickCallback, repeats);
        timer.start();

        return timer;
    }

    /**
     * Increases tick count.
     * Calls tick callback.
     *
     * @private
     */
    private _timerTick() {

        this._tickCount++;

        if (this.tickCallback) {
            this.tickCallback(this._tickCount, this.elapsedTime);
        }

        this.events.trigger(Events.TICK, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    }
}
