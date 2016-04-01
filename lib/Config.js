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
        this.data = this.data || {};
        this.cache = this.cache || {};
        if (!key) {
            return this.data;
        }
        if (this.cache[key]) {
            return this.cache[key];
        }
        var segs = key.split('.');
        var root = this.data;
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
        return this.cache[key] = root;
    };
    Config.prototype.set = function (key, value) {
        this.cache = this.cache || {};
        this.data = this.data || {};
        var segs = key.split('.');
        var root = this.data;
        for (var i = 0; i < segs.length; i++) {
            var part = segs[i];
            if (root[part] === void 0 && i !== segs.length - 1) {
                root[part] = {};
            }
            root = root[part];
        }
        this.cache[key] = root = value;
        return this;
    };
    Config.prototype.load = function (value) {
        this.data = value;
        return this;
    };
    Config.prototype.has = function (key) {
        return (this.get(key) !== null);
    };
    Config.prototype.clear = function (key) {
        if (key) {
            this.cache = this.cache || {};
            this.data = this.data || {};
            if (!this.has(key)) {
                return this;
            }
            delete this.cache[key];
            var segs = key.split('.');
            var root = this.data;
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
        this.cache = {};
        this.data = {};
        return this;
    };
    return Config;
}(EventEmitter_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Config;
