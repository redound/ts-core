"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var DictionaryEvents;
(function (DictionaryEvents) {
    DictionaryEvents.ADD = "add";
    DictionaryEvents.CHANGE = "change";
    DictionaryEvents.REMOVE = "remove";
    DictionaryEvents.CLEAR = "clear";
})(DictionaryEvents = exports.DictionaryEvents || (exports.DictionaryEvents = {}));
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary(data) {
        _super.call(this);
        this._itemCount = 0;
        this.events = new EventEmitter_1.default();
        this._data = data || {};
        this._itemCount = Object.keys(this._data).length;
    }
    Dictionary.prototype.get = function (key) {
        var foundPair = this._getPair(key);
        return foundPair ? foundPair.value : null;
    };
    Dictionary.prototype.set = function (key, value) {
        if (key == null || key == undefined) {
            return;
        }
        if (_.isObject(key)) {
            this._assignUniqueID(key);
        }
        var alreadyExisted = this.contains(key);
        var keyString = this._getKeyString(key);
        this._data[keyString] = {
            key: keyString,
            originalKey: key,
            value: value
        };
        if (!alreadyExisted) {
            this._itemCount++;
        }
        this.events.trigger(DictionaryEvents.ADD, { key: key, value: value });
        this.events.trigger(DictionaryEvents.CHANGE);
    };
    Dictionary.prototype.remove = function (key) {
        var removedItem = null;
        var foundPair = this._getPair(key);
        if (foundPair) {
            delete this._data[foundPair.key];
            removedItem = foundPair.value;
            this._itemCount--;
            this.events.trigger(DictionaryEvents.REMOVE, { key: key, value: removedItem });
            this.events.trigger(DictionaryEvents.CHANGE);
        }
        return removedItem;
    };
    Dictionary.prototype.contains = function (key) {
        return this._getPair(key) != null;
    };
    Dictionary.prototype.containsValue = function (value) {
        var foundValue = null;
        this.each(function (itKey, itValue) {
            if (itValue == value) {
                foundValue = itValue;
                return false;
            }
        });
        return foundValue != null;
    };
    Dictionary.prototype.each = function (iterator) {
        _.each(this._data, function (pair) {
            return iterator(pair.originalKey, pair.value);
        });
    };
    Dictionary.prototype.values = function () {
        return _.pluck(_.values(this._data), 'value');
    };
    Dictionary.prototype.keys = function () {
        return _.pluck(_.values(this._data), 'originalKey');
    };
    Dictionary.prototype.count = function () {
        return this._itemCount;
    };
    Dictionary.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    Dictionary.prototype.clear = function () {
        this._data = {};
        this._itemCount = 0;
        this.events.trigger(DictionaryEvents.CLEAR);
        this.events.trigger(DictionaryEvents.CHANGE);
    };
    Dictionary.prototype.toObject = function () {
        var result = {};
        _.each(_.values(this._data), function (item) {
            result[item.originalKey] = item.value;
        });
        return result;
    };
    Dictionary.prototype.toArray = function () {
        return this.values();
    };
    Dictionary.prototype.all = function () {
        return this.values();
    };
    Dictionary.prototype.clone = function () {
        return new Dictionary(this._data);
    };
    Dictionary.prototype._getPair = function (key) {
        var keyString = this._getKeyString(key);
        var foundPair = null;
        if (keyString != null && keyString != undefined) {
            foundPair = this._data[keyString];
        }
        return foundPair;
    };
    Dictionary.prototype._getKeyString = function (key) {
        if (key == null || key == undefined) {
            return null;
        }
        if (_.isString(key)) {
            return 's_' + key;
        }
        else if (_.isNumber(key)) {
            return 'n_' + key;
        }
        else {
            return key[Dictionary._OBJECT_UNIQUE_ID_KEY];
        }
    };
    Dictionary.prototype._assignUniqueID = function (object) {
        object[Dictionary._OBJECT_UNIQUE_ID_KEY] = '_' + Dictionary._OBJECT_UNIQUE_ID_COUNTER;
        Dictionary._OBJECT_UNIQUE_ID_COUNTER++;
    };
    Dictionary._OBJECT_UNIQUE_ID_KEY = '__TSCore_Object_Unique_ID';
    Dictionary._OBJECT_UNIQUE_ID_COUNTER = 1;
    return Dictionary;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
