"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Dictionary_1 = require("../Data/Dictionary");
(function (LOG_LEVELS) {
    LOG_LEVELS[LOG_LEVELS["LOG"] = 0] = "LOG";
    LOG_LEVELS[LOG_LEVELS["INFO"] = 1] = "INFO";
    LOG_LEVELS[LOG_LEVELS["WARN"] = 2] = "WARN";
    LOG_LEVELS[LOG_LEVELS["ERROR"] = 3] = "ERROR";
    LOG_LEVELS[LOG_LEVELS["FATAL"] = 4] = "FATAL";
})(exports.LOG_LEVELS || (exports.LOG_LEVELS = {}));
var LOG_LEVELS = exports.LOG_LEVELS;
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger(parent, tag) {
        _super.call(this);
        this._parent = parent;
        this._tag = tag;
        this._streams = this._parent ? this._parent.getStreams() : new Dictionary_1.default();
    }
    Logger.prototype.child = function (tag) {
        return new Logger(this, tag);
    };
    Logger.prototype.addStream = function (key, stream, level) {
        if (level === void 0) { level = LOG_LEVELS.LOG; }
        this._streams.set(key, {
            level: level,
            stream: stream
        });
    };
    Logger.prototype.removeStream = function (key) {
        this._streams.remove(key);
    };
    Logger.prototype.getStreams = function () {
        return this._streams;
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LOG_LEVELS.LOG, args);
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LOG_LEVELS.INFO, args);
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LOG_LEVELS.WARN, args);
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LOG_LEVELS.ERROR, args);
    };
    Logger.prototype.fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LOG_LEVELS.FATAL, args);
    };
    Logger.prototype._exec = function (level, args) {
        var tag = this._tag || args.shift();
        this._streams.each(function (key, streamEntry) {
            if (level >= streamEntry.level) {
                streamEntry.stream.exec({
                    level: level,
                    tag: tag,
                    args: args,
                    time: new Date().getTime()
                });
            }
        });
    };
    return Logger;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logger;
