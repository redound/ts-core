"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var _ = require("underscore");
exports.SortedListEvents = {
    ADD: 'add',
    CHANGE: 'change',
    REMOVE: 'remove',
    REPLACE: 'replace',
    CLEAR: 'clear',
    SORT: 'sort'
};
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
        this.data = data || [];
        this.sortPredicate = sortPredicate;
        this.sortDirection = direction;
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
        return this.data.length;
    };
    SortedList.prototype.add = function (item) {
        var sortedIndex = this.sortedIndex(item);
        this.data.splice(sortedIndex, 0, item);
        var addedItems = [{ item: item, index: sortedIndex }];
        this.events.trigger(exports.SortedListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.sortedIndex = function (item) {
        var target = _.clone(this.data);
        if (this.sortDirection === SortedListDirection.DESCENDING) {
            target.reverse();
        }
        return _.sortedIndex(target, item, this.sortPredicate);
    };
    SortedList.prototype.addMany = function (items) {
        var _this = this;
        if (items === void 0) { items = []; }
        this.data = this.data.concat(items);
        this.sort();
        var addedItems = [];
        _.each(items, function (item) {
            addedItems.push({
                item: item,
                index: _this.indexOf(item)
            });
        });
        this.events.trigger(exports.SortedListEvents.ADD, { operations: addedItems });
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.remove = function (item) {
        var removedItems = [{
                item: item,
                index: this.indexOf(item)
            }];
        this.data = _.without(this.data, item);
        this.sort();
        this.events.trigger(exports.SortedListEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.removeMany = function (items) {
        var _this = this;
        var removedItems = _.map(items, function (item) {
            return {
                item: item,
                index: _this.indexOf(item)
            };
        });
        this.data = _.difference(this.data, items);
        this.sort();
        this.events.trigger(exports.SortedListEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    SortedList.prototype.replaceItem = function (source, replacement) {
        var index = _.indexOf(this.data, source);
        if (index < 0 || index >= this.count()) {
            return null;
        }
        var currentItem = this.data[index];
        this.data[index] = replacement;
        this.sort();
        this.events.trigger(exports.SortedListEvents.REPLACE, { source: source, replacement: replacement });
        this.events.trigger(exports.SortedListEvents.CHANGE);
        return currentItem;
    };
    SortedList.prototype.clear = function () {
        var removedItems = _.map(this.data, function (item, index) {
            return {
                item: item,
                index: index
            };
        });
        this.data = [];
        this.events.trigger(exports.SortedListEvents.REMOVE, {
            operations: removedItems,
            clear: true
        });
        this.events.trigger(exports.SortedListEvents.CLEAR);
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.each = function (iterator) {
        _.each(this.data, iterator);
    };
    SortedList.prototype.map = function (iterator, context) {
        var data = _.map(this.data, iterator, context);
        return new SortedList(data, this.sortPredicate, this.sortDirection);
    };
    SortedList.prototype.pluck = function (propertyName) {
        return _.pluck(this.data, propertyName);
    };
    SortedList.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    SortedList.prototype.first = function () {
        return _.first(this.data);
    };
    SortedList.prototype.last = function () {
        return _.last(this.data);
    };
    SortedList.prototype.get = function (index) {
        return this.data[index];
    };
    SortedList.prototype.indexOf = function (item) {
        return _.indexOf(this.data, item);
    };
    SortedList.prototype.find = function (iterator) {
        return _.filter(this.data, iterator);
    };
    SortedList.prototype.findFirst = function (iterator) {
        return _.find(this.data, iterator);
    };
    SortedList.prototype.where = function (properties) {
        return _.where(this.data, properties);
    };
    SortedList.prototype.whereFirst = function (properties) {
        return _.findWhere(this.data, properties);
    };
    SortedList.prototype.contains = function (item) {
        return _.contains(this.data, item);
    };
    SortedList.prototype.toArray = function () {
        return _.clone(this.data);
    };
    SortedList.prototype.all = function () {
        return _.clone(this.data);
    };
    SortedList.prototype.clone = function () {
        return new SortedList(_.clone(this.data), this.sortPredicate);
    };
    SortedList.prototype.sort = function () {
        if (this.sortPredicate === null || this.sortPredicate === undefined) {
            return;
        }
        this.data = _.sortBy(this.data, this.sortPredicate);
        if (this.sortDirection === SortedListDirection.DESCENDING) {
            this.data.reverse();
        }
        this.events.trigger(exports.SortedListEvents.SORT);
        this.events.trigger(exports.SortedListEvents.CHANGE);
    };
    SortedList.prototype.setSortPredicate = function (predicate, direction) {
        if (direction === void 0) { direction = SortedListDirection.ASCENDING; }
        this.sortPredicate = predicate;
        this.sortDirection = direction;
        this.sort();
    };
    SortedList.prototype.getSortPredicate = function () {
        return this.sortPredicate;
    };
    SortedList.prototype.isAscending = function () {
        return this.sortDirection === SortedListDirection.ASCENDING;
    };
    SortedList.prototype.isDescending = function () {
        return this.sortDirection === SortedListDirection.DESCENDING;
    };
    SortedList.prototype.getSortDirection = function () {
        return this.sortDirection;
    };
    return SortedList;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortedList;
