"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(data) {
        _super.call(this);
        this.events = new EventEmitter_1.default();
        _.defaults(this, this.static.defaults());
        if (data) {
            this.assignAll(data);
        }
    }
    Model.prototype.set = function (key, value) {
        this[key] = value;
    };
    Model.prototype.get = function (key) {
        return this[key];
    };
    Model.primaryKey = function () {
        return 'id';
    };
    Model.whitelist = function () {
        return [];
    };
    Model.defaults = function () {
        return {};
    };
    Model.prototype.getId = function () {
        return this[this.static.primaryKey()];
    };
    Model.prototype.assign = function (data) {
        var _this = this;
        _.each(this.static.whitelist(), function (attr) {
            if (!_.isUndefined(data[attr])) {
                _this[attr] = data[attr];
            }
        });
        return this;
    };
    Model.prototype.assignAll = function (data) {
        var _this = this;
        _.each(data, function (value, attr) {
            if (!_.isUndefined(data[attr])) {
                _this[attr] = data[attr];
            }
        });
        return this;
    };
    Model.prototype.merge = function (model) {
        this.assignAll(model.toObject());
    };
    Model.prototype.equals = function (data) {
        var _this = this;
        if (data instanceof Model) {
            data = data.toObject();
        }
        var equal = true;
        _.each(this.getDataKeys(), function (key) {
            if (equal && _this[key] != data[key]) {
                equal = false;
            }
        });
        return equal;
    };
    Model.prototype.getDataKeys = function () {
        return _.filter(_.keys(this), function (key) {
            return key.slice(0, 1) != '_';
        });
    };
    Model.prototype.toObject = function (recursive) {
        var _this = this;
        if (recursive === void 0) { recursive = false; }
        var result = {};
        _.each(this.getDataKeys(), function (key) {
            var value = _this[key];
            var parsedValue = value;
            if (recursive && value instanceof Model) {
                parsedValue = value.toObject();
            }
            result[key] = parsedValue;
        });
        return result;
    };
    return Model;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
