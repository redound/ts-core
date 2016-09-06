"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var _ = require("underscore");
exports.ListEvents = {
    ADD: 'add',
    CHANGE: 'change',
    REMOVE: 'remove',
    REPLACE: 'replace',
    CLEAR: 'clear'
};
var List = (function (_super) {
    __extends(List, _super);
    function List(data) {
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this.data = data || [];
    }
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.count = function () {
        return this.data.length;
    };
    List.prototype.add = function (item) {
        var count = this.data.push(item);
        var addedItems = [{ item: item, index: count - 1 }];
        this.events.trigger(exports.ListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.addMany = function (items) {
        if (items === void 0) { items = []; }
        this.data = this.data.concat(items);
        var index = this.data.length;
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });
        this.events.trigger(exports.ListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.prepend = function (item) {
        this.insert(item, 0);
    };
    List.prototype.prependMany = function (items) {
        this.data = items.concat(this.data);
        var index = 0;
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });
        this.events.trigger(exports.ListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.insert = function (item, index) {
        this.data.splice(index, 0, item);
        var addedItems = [{
                item: item,
                index: index
            }];
        this.events.trigger(exports.ListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.remove = function (item) {
        var index = this.indexOf(item);
        this.data = _.without(this.data, item);
        var removedItems = [{
                item: item,
                index: index
            }];
        this.events.trigger(exports.ListEvents.REMOVE, { operations: removedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
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
        this.data = _.difference(this.data, items);
        this.events.trigger(exports.ListEvents.REMOVE, { operations: removedItems });
        this.events.trigger(exports.ListEvents.CHANGE);
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
        var currentItem = this.data[index];
        this.data[index] = replacement;
        this.events.trigger(exports.ListEvents.REPLACE, { source: currentItem, replacement: replacement });
        this.events.trigger(exports.ListEvents.CHANGE);
        return currentItem;
    };
    List.prototype.clear = function () {
        var removedItems = _.map(this.data, function (item, index) {
            return {
                item: item,
                index: index
            };
        });
        this.data = [];
        this.events.trigger(exports.ListEvents.REMOVE, { operations: removedItems, clear: true });
        this.events.trigger(exports.ListEvents.CLEAR);
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.each = function (iterator) {
        _.each(this.data, iterator);
    };
    List.prototype.map = function (iterator, context) {
        var data = _.map(this.data, iterator, context);
        return new List(data);
    };
    List.prototype.pluck = function (propertyName) {
        var data = _.pluck(_.clone(this.data), propertyName);
        return new List(data);
    };
    List.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    List.prototype.first = function () {
        return _.first(this.data);
    };
    List.prototype.last = function () {
        return _.last(this.data);
    };
    List.prototype.get = function (index) {
        return this.data[index];
    };
    List.prototype.indexOf = function (item) {
        return _.indexOf(this.data, item);
    };
    List.prototype.sort = function (sortPredicate) {
        this.data = _.sortBy(this.data, sortPredicate);
        this.events.trigger(exports.ListEvents.CHANGE);
    };
    List.prototype.find = function (iterator) {
        return _.filter(this.data, iterator);
    };
    List.prototype.findFirst = function (iterator) {
        return _.find(this.data, iterator);
    };
    List.prototype.where = function (properties) {
        return _.where(this.data, properties);
    };
    List.prototype.whereFirst = function (properties) {
        return _.findWhere(this.data, properties);
    };
    List.prototype.contains = function (item) {
        return _.contains(this.data, item);
    };
    List.prototype.toArray = function () {
        return _.clone(this.data);
    };
    List.prototype.all = function () {
        return _.clone(this.data);
    };
    List.prototype.clone = function () {
        return new List(_.clone(this.data));
    };
    return List;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;
