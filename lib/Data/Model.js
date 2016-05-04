"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var _ = require("underscore");
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(data) {
        _super.call(this);
        _.defaults(this, this.source.defaults());
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
        return this[this.source.primaryKey()];
    };
    Model.prototype.assign = function (data) {
        var _this = this;
        _.each(this.source.whitelist(), function (attr) {
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
            return !/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(key.slice(0, 1));
        });
    };
    Model.prototype.toObject = function (recursive, skipObjects) {
        var _this = this;
        if (recursive === void 0) { recursive = false; }
        if (skipObjects === void 0) { skipObjects = []; }
        var result = {};
        var parse = function (value) {
            return recursive ? Model.recursiveToObject(value, skipObjects.concat([_this])) : value;
        };
        _.each(this.getDataKeys(), function (key) {
            var value = _this[key];
            var parsedValue = _.isArray(value) ? _.map(value, parse) : parse(value);
            if (parsedValue != _this) {
                result[key] = _.clone(parsedValue);
            }
        });
        return result;
    };
    Model.recursiveToObject = function (data, skipObjects) {
        if (skipObjects === void 0) { skipObjects = []; }
        var result = data;
        if (data instanceof Model) {
            result = data.toObject(true, skipObjects);
            if (skipObjects && skipObjects.length) {
                _.each(_.clone(result), function (parsedFieldVal, parsedFieldKey) {
                    if (_.contains(skipObjects, parsedFieldVal)) {
                        delete result[parsedFieldKey];
                    }
                });
            }
        }
        return result;
    };
    Model.prototype.toString = function () {
        return "Model";
    };
    return Model;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
