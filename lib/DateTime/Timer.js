"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var Events;
(function (Events) {
    Events.START = "start";
    Events.PAUSE = "pause";
    Events.RESUME = "resume";
    Events.STOP = "stop";
    Events.TICK = "tick";
})(Events = exports.Events || (exports.Events = {}));
var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer(timeout, tickCallback, repeats) {
        if (tickCallback === void 0) { tickCallback = null; }
        if (repeats === void 0) { repeats = false; }
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this.timeout = timeout;
        this.tickCallback = tickCallback;
        this.repeats = repeats;
    }
    Object.defineProperty(Timer.prototype, "tickCount", {
        get: function () {
            return this._tickCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "elapsedTime", {
        get: function () {
            if (!this._startDate) {
                return null;
            }
            return new Date().getTime() - this._startDate.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "isStarted", {
        get: function () {
            return this._isStarted;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.start = function () {
        if (this._isStarted) {
            return;
        }
        this._tickCount = 0;
        this._startDate = new Date();
        this.events.trigger(Events.START, {
            startDate: this._startDate
        });
        this.resume();
    };
    Timer.prototype.resume = function () {
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
    };
    Timer.prototype.pause = function () {
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
    };
    Timer.prototype.restart = function () {
        this.stop();
        this.start();
    };
    Timer.prototype.stop = function () {
        var eventParams = {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        };
        this.reset();
        this.events.trigger(Events.STOP, eventParams);
    };
    Timer.prototype.reset = function () {
        if (this._isStarted) {
            this.pause();
        }
        this._tickCount = 0;
        this._startDate = null;
    };
    Timer.start = function (timeout, tickCallback, repeats) {
        if (tickCallback === void 0) { tickCallback = null; }
        if (repeats === void 0) { repeats = false; }
        var timer = new this(timeout, tickCallback, repeats);
        timer.start();
        return timer;
    };
    Timer.prototype._timerTick = function () {
        this._tickCount++;
        if (this.tickCallback) {
            this.tickCallback(this._tickCount, this.elapsedTime);
        }
        this.events.trigger(Events.TICK, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    };
    return Timer;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Timer;
