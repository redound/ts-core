"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventEmitter_1 = require("./Events/EventEmitter");
var Config = (function (_super) {
    __extends(Config, _super);
    function Config(data) {
        _super.call(this);
        if (data) {
            this.load(data);
        }
    }
    Config.prototype.get = function (key) {
        this._data = this._data || {};
        this._cache = this._cache || {};
        if (!key) {
            return this._data;
        }
        if (this._cache[key]) {
            return this._cache[key];
        }
        var segs = key.split('.');
        var root = this._data;
        for (var i = 0; i < segs.length; i++) {
            var part = segs[i];
            if (root[part] !== void 0) {
                root = root[part];
            }
            else {
                root = null;
                break;
            }
        }
        return this._cache[key] = root;
    };
    Config.prototype.set = function (key, value) {
        this._cache = this._cache || {};
        this._data = this._data || {};
        var segs = key.split('.');
        var root = this._data;
        for (var i = 0; i < segs.length; i++) {
            var part = segs[i];
            if (root[part] === void 0 && i !== segs.length - 1) {
                root[part] = {};
            }
            root = root[part];
        }
        this._cache[key] = root = value;
        return this;
    };
    Config.prototype.load = function (value) {
        this._data = value;
        return this;
    };
    Config.prototype.has = function (key) {
        return (this.get(key) !== null);
    };
    Config.prototype.clear = function (key) {
        if (key) {
            this._cache = this._cache || {};
            this._data = this._data || {};
            if (!this.has(key)) {
                return this;
            }
            delete this._cache[key];
            var segs = key.split('.');
            var root = this._data;
            for (var i = 0; i < segs.length; i++) {
                var part = segs[i];
                if (!root[part]) {
                    break;
                }
                if (i === segs.length - 1) {
                    delete root[part];
                }
                root = root[part];
            }
            return this;
        }
        this._cache = {};
        this._data = {};
        return this;
    };
    return Config;
}(EventEmitter_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Config;
