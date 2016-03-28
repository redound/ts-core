"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var SortedListEvents;
(function (SortedListEvents) {
    SortedListEvents.ADD = "add";
    SortedListEvents.CHANGE = "change";
    SortedListEvents.REMOVE = "remove";
    SortedListEvents.REPLACE = "replace";
    SortedListEvents.CLEAR = "clear";
    SortedListEvents.SORT = "sort";
})(SortedListEvents = exports.SortedListEvents || (exports.SortedListEvents = {}));
(function (SortedListDirection) {
    SortedListDirection[SortedListDirection["ASCENDING"] = 0] = "ASCENDING";
    SortedListDirection[SortedListDirection["DESCENDING"] = 1] = "DESCENDING";
})(exports.SortedListDirection || (exports.SortedListDirection = {}));
var SortedListDirection = exports.SortedListDirection;
var SortedList = (function (_super) {
    __extends(SortedList, _super);
    function SortedList(data, sortPredicate, direction) {
        if (data === void 0) { data = null; }
        if (sortPredicate === void 0) { sortPredicate = null; }
        if (direction === void 0) { direction = SortedListDirection.ASCENDING; }
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this._data = data || [];
        this._sortPredicate = sortPredicate;
        this._sortDirection = direction;
        this.sort();
    }
    Object.defineProperty(SortedList.prototype, "length", {
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    SortedList.prototype.count = function () {
        return this._data.length;
    };
    SortedList.prototype.add = function (item) {
        var sortedIndex = this.sortedIndex(item);
        this._data.splice(sortedIndex, 0, item);
        var addedItems = [{ item: item, index: sortedIndex }];
        this.events.trigger(SortedListEvents.ADD, { operations: addedItems });
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.sortedIndex = function (item) {
        var target = _.clone(this._data);
        if (this._sortDirection === SortedListDirection.DESCENDING) {
            target.reverse();
        }
        return _.sortedIndex(target, item, this._sortPredicate);
    };
    SortedList.prototype.addMany = function (items) {
        var _this = this;
        if (items === void 0) { items = []; }
        this._data = this._data.concat(items);
        this.sort();
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: _this.indexOf(item)
            });
        });
        this.events.trigger(SortedListEvents.ADD, { operations: addedItems });
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.remove = function (item) {
        var removedItems = [{
                item: item,
                index: this.indexOf(item)
            }];
        this._data = _.without(this._data, item);
        this.sort();
        this.events.trigger(SortedListEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.removeMany = function (items) {
        var _this = this;
        var removedItems = _.map(items, function (item) {
            return {
                item: item,
                index: _this.indexOf(item)
            };
        });
        this._data = _.difference(this._data, items);
        this.sort();
        this.events.trigger(SortedListEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    SortedList.prototype.replaceItem = function (source, replacement) {
        var index = _.indexOf(this._data, source);
        if (index < 0 || index >= this.count()) {
            return null;
        }
        var currentItem = this._data[index];
        this._data[index] = replacement;
        this.sort();
        this.events.trigger(SortedListEvents.REPLACE, { source: source, replacement: replacement });
        this.events.trigger(SortedListEvents.CHANGE);
        return currentItem;
    };
    SortedList.prototype.clear = function () {
        var removedItems = _.map(this._data, function (item, index) {
            return {
                item: item,
                index: index
            };
        });
        this._data = [];
        this.events.trigger(SortedListEvents.REMOVE, {
            operations: removedItems,
            clear: true
        });
        this.events.trigger(SortedListEvents.CLEAR);
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    SortedList.prototype.map = function (iterator, context) {
        var data = _.map(this._data, iterator, context);
        return new SortedList(data, this._sortPredicate, this._sortDirection);
    };
    SortedList.prototype.pluck = function (propertyName) {
        return _.pluck(this._data, propertyName);
    };
    SortedList.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    SortedList.prototype.first = function () {
        return _.first(this._data);
    };
    SortedList.prototype.last = function () {
        return _.last(this._data);
    };
    SortedList.prototype.get = function (index) {
        return this._data[index];
    };
    SortedList.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    SortedList.prototype.find = function (iterator) {
        return _.filter(this._data, iterator);
    };
    SortedList.prototype.findFirst = function (iterator) {
        return _.find(this._data, iterator);
    };
    SortedList.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    SortedList.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    SortedList.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    SortedList.prototype.toArray = function () {
        return _.clone(this._data);
    };
    SortedList.prototype.all = function () {
        return _.clone(this._data);
    };
    SortedList.prototype.clone = function () {
        return new SortedList(_.clone(this._data), this._sortPredicate);
    };
    SortedList.prototype.sort = function () {
        if (this._sortPredicate === null || this._sortPredicate === undefined) {
            return;
        }
        this._data = _.sortBy(this._data, this._sortPredicate);
        if (this._sortDirection === SortedListDirection.DESCENDING) {
            this._data.reverse();
        }
        this.events.trigger(SortedListEvents.SORT);
        this.events.trigger(SortedListEvents.CHANGE);
    };
    SortedList.prototype.setSortPredicate = function (predicate, direction) {
        if (direction === void 0) { direction = SortedListDirection.ASCENDING; }
        this._sortPredicate = predicate;
        this._sortDirection = direction;
        this.sort();
    };
    SortedList.prototype.getSortPredicate = function () {
        return this._sortPredicate;
    };
    SortedList.prototype.isAscending = function () {
        return this._sortDirection === SortedListDirection.ASCENDING;
    };
    SortedList.prototype.isDescending = function () {
        return this._sortDirection === SortedListDirection.DESCENDING;
    };
    SortedList.prototype.getSortDirection = function () {
        return this._sortDirection;
    };
    return SortedList;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortedList;
