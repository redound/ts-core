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
    constructor(timeout: number, tickCallback?: TimerTickCallbackInterface, repeats?: boolean);
    start(): void;
    resume(): void;
    pause(): void;
    restart(): void;
    stop(): void;
    reset(): void;
    static start(timeout: number, tickCallback?: TimerTickCallbackInterface, repeats?: boolean): Timer;
    private _timerTick();
}
