"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Event = (function (_super) {
    __extends(Event, _super);
    function Event(topic, _params, caller) {
        _super.call(this);
        this.topic = topic;
        this._params = _params;
        this.caller = caller;
        this.isStopped = false;
    }
    Object.defineProperty(Event.prototype, "params", {
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    Event.prototype.stop = function () {
        this.isStopped = true;
    };
    return Event;
}(BaseObject_1.default));
exports.Event = Event;
var EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    function EventEmitter() {
        _super.call(this);
        this._eventCallbacks = {};
    }
    EventEmitter.prototype.on = function (topics, callback, context, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        _.each(topics.split(' '), function (topic) {
            var callbackArray = _this._eventCallbacks[topic];
            if (!callbackArray) {
                callbackArray = [];
                _this._eventCallbacks[topic] = callbackArray;
            }
            callbackArray.push({
                topic: topic,
                callback: callback,
                context: context,
                once: once
            });
        });
        return this;
    };
    EventEmitter.prototype.once = function (topics, callback, context) {
        return this.on.apply(this, [topics, callback, context, true]);
    };
    EventEmitter.prototype.off = function (topics, callback, context) {
        var _this = this;
        _.each(topics.split(' '), function (topic) {
            var callbackArray = _this._eventCallbacks[topic];
            if (!callbackArray) {
                return;
            }
            if (!callback) {
                delete _this._eventCallbacks[topic];
                return;
            }
            var callbacksToRemove = _.where(callbackArray, context ? {
                callback: callback,
                context: context
            } : { callback: callback });
            callbackArray = _.difference(callbackArray, callbacksToRemove);
            if (callbackArray.length == 0) {
                delete _this._eventCallbacks[topic];
            }
            else {
                _this._eventCallbacks[topic] = callbackArray;
            }
        });
        return this;
    };
    EventEmitter.prototype.trigger = function (topic, params, caller) {
        var _this = this;
        var callbackArray = this._eventCallbacks[topic];
        if (!callbackArray) {
            return;
        }
        var event = new Event(topic, params, caller);
        _.each(callbackArray, function (item) {
            if (event.isStopped) {
                return;
            }
            item.callback.apply(item.context || _this, [event]);
            if (item.once) {
                _this.off(topic, item.callback, item.context);
            }
        });
        return this;
    };
    EventEmitter.prototype.reset = function () {
        this._eventCallbacks = {};
        return this;
    };
    return EventEmitter;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventEmitter;
