"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var CollectionEvents;
(function (CollectionEvents) {
    CollectionEvents.ADD = "add";
    CollectionEvents.CHANGE = "change";
    CollectionEvents.REMOVE = "remove";
    CollectionEvents.REPLACE = "replace";
    CollectionEvents.CLEAR = "clear";
})(CollectionEvents = exports.CollectionEvents || (exports.CollectionEvents = {}));
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(data) {
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this._data = data || [];
    }
    Object.defineProperty(Collection.prototype, "length", {
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.count = function () {
        return this._data.length;
    };
    Collection.prototype.add = function (item) {
        if (this.contains(item)) {
            return null;
        }
        this._data.push(item);
        var addedItems = [{
                item: item,
                index: this.indexOf(item)
            }];
        this.events.trigger(CollectionEvents.ADD, { operations: addedItems });
        this.events.trigger(CollectionEvents.CHANGE);
        return item;
    };
    Collection.prototype.addMany = function (items) {
        var _this = this;
        var itemsToAdd = [];
        _.each(items, function (item) {
            if (!_this.contains(item)) {
                itemsToAdd.push(item);
            }
        });
        if (itemsToAdd.length > 0) {
            this._data = this._data.concat(itemsToAdd);
            var addedItems = _.map(itemsToAdd, function (item) {
                return {
                    item: item,
                    index: _this.indexOf(item)
                };
            });
            this.events.trigger(CollectionEvents.ADD, { operations: addedItems });
            this.events.trigger(CollectionEvents.CHANGE);
        }
        return itemsToAdd;
    };
    Collection.prototype.remove = function (item) {
        var removedItems = [{
                item: item,
                index: this.indexOf(item)
            }];
        this._data = _.without(this._data, item);
        this.events.trigger(CollectionEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(CollectionEvents.CHANGE);
    };
    Collection.prototype.removeMany = function (items) {
        var _this = this;
        var removedItems = _.map(items, function (item) {
            return {
                item: item,
                index: _this.indexOf(item)
            };
        });
        this._data = _.difference(this._data, items);
        this.events.trigger(CollectionEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(CollectionEvents.CHANGE);
    };
    Collection.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    Collection.prototype.replaceItem = function (source, replacement) {
        var index = _.indexOf(this._data, source);
        if (index < 0 || index >= this.count()) {
            return null;
        }
        var currentItem = this._data[index];
        this._data[index] = replacement;
        this.events.trigger(CollectionEvents.REPLACE, { source: source, replacement: replacement });
        this.events.trigger(CollectionEvents.CHANGE);
        return currentItem;
    };
    Collection.prototype.clear = function () {
        var removedItems = _.map(this._data, function (item, index) {
            return {
                item: item,
                index: index
            };
        });
        this._data = [];
        this.events.trigger(CollectionEvents.REMOVE, { operations: removedItems, clear: true });
        this.events.trigger(CollectionEvents.CLEAR);
        this.events.trigger(CollectionEvents.CHANGE);
    };
    Collection.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    Collection.prototype.pluck = function (propertyName) {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new Collection(data);
    };
    Collection.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    Collection.prototype.filter = function (iterator) {
        return _.filter(this._data, iterator);
    };
    Collection.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    Collection.prototype.find = function (iterator) {
        return _.find(this._data, iterator);
    };
    Collection.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    Collection.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    Collection.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    Collection.prototype.map = function (iterator, context) {
        var data = _.map(_.clone(this._data), iterator, context);
        return new Collection(data);
    };
    Collection.prototype.transform = function (iterator, context) {
        this._data = _.map(this._data, iterator, context);
        return this;
    };
    Collection.prototype.reject = function (iterator, context) {
        var data = _.reject(_.clone(this._data), iterator, context);
        return new Collection(data);
    };
    Collection.prototype.toArray = function () {
        return _.clone(this._data);
    };
    Collection.prototype.all = function () {
        return _.clone(this._data);
    };
    Collection.prototype.clone = function () {
        return new Collection(_.clone(this._data));
    };
    return Collection;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Collection;
