"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Logger_1 = require("../Logger");
var BaseObject_1 = require("../../BaseObject");
var ConsoleStream = (function (_super) {
    __extends(ConsoleStream, _super);
    function ConsoleStream(_console, colorsEnabled) {
        if (colorsEnabled === void 0) { colorsEnabled = true; }
        _super.call(this);
        this._console = _console;
        this.colorsEnabled = colorsEnabled;
    }
    ConsoleStream.prototype.exec = function (options) {
        var method;
        switch (options.level) {
            case Logger_1.LogLevels.LOG:
                method = 'log';
                break;
            case Logger_1.LogLevels.INFO:
                method = 'info';
                break;
            case Logger_1.LogLevels.WARN:
                method = 'warn';
                break;
            case Logger_1.LogLevels.ERROR:
                method = 'error';
                break;
        }
        var optionArgs = options.args || [];
        var args = [];
        if (this.colorsEnabled) {
            var tagBackgroundColor = this._generateHex(options.tag);
            var tagTextColor = this._getIdealTextColor(tagBackgroundColor);
            args = ['%c ' + options.tag + ' ', 'background: ' + tagBackgroundColor + '; color: ' + tagTextColor + ';'].concat(optionArgs);
        }
        else {
            args = [options.tag].concat(optionArgs);
        }
        this._console[method].apply(this._console, args);
    };
    ConsoleStream.prototype._generateHex = function (input) {
        for (var i = 0, hash = 0; i < input.length; hash = input.charCodeAt(i++) + ((hash << 5) - hash))
            ;
        for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2))
            ;
        return colour;
    };
    ConsoleStream.prototype._getIdealTextColor = function (bgColor) {
        var r = bgColor.substring(1, 3);
        var g = bgColor.substring(3, 5);
        var b = bgColor.substring(5, 7);
        var components = {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
        var nThreshold = 105;
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    };
    return ConsoleStream;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConsoleStream;
