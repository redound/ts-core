"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var ListEvents;
(function (ListEvents) {
    ListEvents.ADD = "add";
    ListEvents.CHANGE = "change";
    ListEvents.REMOVE = "remove";
    ListEvents.REPLACE = "replace";
    ListEvents.CLEAR = "clear";
})(ListEvents = exports.ListEvents || (exports.ListEvents = {}));
var List = (function (_super) {
    __extends(List, _super);
    function List(data) {
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this._data = data || [];
    }
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.count = function () {
        return this._data.length;
    };
    List.prototype.add = function (item) {
        var count = this._data.push(item);
        var addedItems = [{ item: item, index: count - 1 }];
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.addMany = function (items) {
        if (items === void 0) { items = []; }
        this._data = this._data.concat(items);
        var index = this._data.length;
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.prepend = function (item) {
        this.insert(item, 0);
    };
    List.prototype.prependMany = function (items) {
        this._data = items.concat(this._data);
        var index = 0;
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.insert = function (item, index) {
        this._data.splice(index, 0, item);
        var addedItems = [{
                item: item,
                index: index
            }];
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.remove = function (item) {
        var index = this.indexOf(item);
        this._data = _.without(this._data, item);
        var removedItems = [{
                item: item,
                index: index
            }];
        this.events.trigger(ListEvents.REMOVE, { operations: removedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.removeAt = function (index) {
        var item = this.get(index);
        this.remove(item);
    };
    List.prototype.removeMany = function (items) {
        var _this = this;
        var removedItems = _.map(items, function (item) {
            return {
                item: item,
                index: _this.indexOf(item)
            };
        });
        this._data = _.difference(this._data, items);
        this.events.trigger(ListEvents.REMOVE, { operations: removedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    List.prototype.replaceItem = function (source, replacement) {
        return this.replace(this.indexOf(source), replacement);
    };
    List.prototype.replace = function (index, replacement) {
        if (index < 0 || index >= this.count()) {
            return null;
        }
        var currentItem = this._data[index];
        this._data[index] = replacement;
        this.events.trigger(ListEvents.REPLACE, { source: currentItem, replacement: replacement });
        this.events.trigger(ListEvents.CHANGE);
        return currentItem;
    };
    List.prototype.clear = function () {
        var removedItems = _.map(this._data, function (item, index) {
            return {
                item: item,
                index: index
            };
        });
        this._data = [];
        this.events.trigger(ListEvents.REMOVE, { operations: removedItems, clear: true });
        this.events.trigger(ListEvents.CLEAR);
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    List.prototype.map = function (iterator, context) {
        var data = _.map(this._data, iterator, context);
        return new List(data);
    };
    List.prototype.pluck = function (propertyName) {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new List(data);
    };
    List.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    List.prototype.first = function () {
        return _.first(this._data);
    };
    List.prototype.last = function () {
        return _.last(this._data);
    };
    List.prototype.get = function (index) {
        return this._data[index];
    };
    List.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    List.prototype.sort = function (sortPredicate) {
        this._data = _.sortBy(this._data, sortPredicate);
        this.events.trigger(ListEvents.CHANGE);
    };
    List.prototype.find = function (iterator) {
        return _.filter(this._data, iterator);
    };
    List.prototype.findFirst = function (iterator) {
        return _.find(this._data, iterator);
    };
    List.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    List.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    List.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    List.prototype.toArray = function () {
        return _.clone(this._data);
    };
    List.prototype.all = function () {
        return _.clone(this._data);
    };
    List.prototype.clone = function () {
        return new List(_.clone(this._data));
    };
    return List;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;
