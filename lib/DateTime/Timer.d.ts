import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
export interface TimerTickCallbackInterface {
    (tickCount: number, elapsedTime: number): void;
}
export declare const TimerEvents: {
    START: string;
    PAUSE: string;
    RESUME: string;
    STOP: string;
    TICK: string;
};
export interface TimerStartParamsInterface {
    startDate: Date;
}
export interface TimerPauseParamsInterface {
    startDate: Date;
    tickCount: number;
    elapsedTime: number;
}
export interface TimerResumeParamsInterface {
    startDate: Date;
    tickCount: number;
    elapsedTime: number;
}
export interface TimerStopParamsInterface {
    startDate: Date;
    tickCount: number;
    elapsedTime: number;
}
export interface TimerTickParamsInterface {
    startDate: Date;
    tickCount: number;
    elapsedTime: number;
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
