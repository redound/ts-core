(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TSCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
///<reference path="../typings/main.d.ts"/>
"use strict";
var BaseObject = (function () {
    function BaseObject() {
    }
    Object.defineProperty(BaseObject.prototype, "static", {
        get: function () {
            return Object.getPrototypeOf(this).constructor;
        },
        enumerable: true,
        configurable: true
    });
    return BaseObject;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseObject;

},{}],2:[function(require,module,exports){
///<reference path="../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventEmitter_1 = require("./Events/EventEmitter");
var Config = (function (_super) {
    __extends(Config, _super);
    /**
     * Load config by passing data to constructor (optional)
     *
     * @param data Any value to load config with.
     */
    function Config(data) {
        _super.call(this);
        if (data) {
            this.load(data);
        }
    }
    /**
     * Get (nested) value for key.
     * When no key is specified it returns
     * the full config.
     *
     * @param key   Key to return value for.
     * @returns {any}
     */
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
    /**
     * Set (nested) value for key.
     *
     * @param key       Key optionally separated by a dot.
     * @param value     Value to set for given key.
     * @returns {Config}
     */
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
    /**
     * Load config with value.
     *
     * @param value Any value.
     * @returns {Config}
     */
    Config.prototype.load = function (value) {
        this._data = value;
        return this;
    };
    /**
     * Check if config has (nested) value for key.
     *
     * @param key Key to check for.
     * @returns {boolean}
     */
    Config.prototype.has = function (key) {
        return (this.get(key) !== null);
    };
    /**
     * Clear the config or when passing a key the value of a that given key.
     *
     * @param key   Optional key to clear value of.
     * @returns {Config}
     */
    Config.prototype.clear = function (key) {
        if (key) {
            this._cache = this._cache || {};
            this._data = this._data || {};
            if (!this.has(key)) {
                return this;
            }
            // Clear from cache
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

},{"./Events/EventEmitter":14}],3:[function(require,module,exports){
///<reference path="../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("./BaseObject");
var Dictionary_1 = require("./Data/Dictionary");
var DI = (function (_super) {
    __extends(DI, _super);
    /**
     * Constructor function.
     */
    function DI() {
        _super.call(this);
        this._services = new Dictionary_1.default();
        this._cache = new Dictionary_1.default();
    }
    /**
     * Resolves the service based on its configuration.
     *
     * @param key Name of the service.
     * @param shared Whether to get a shared instance of the service.
     * @returns {any}
     */
    DI.prototype.get = function (key, shared) {
        if (shared === void 0) { shared = false; }
        var serviceItem = this._services.get(key);
        var instance = null;
        var instantiateShared = shared === true || serviceItem && serviceItem.shared === true;
        if (instantiateShared && this._cache.contains(key)) {
            instance = this._cache.get(key);
        }
        if (serviceItem && !instance) {
            instance = this._instantiate(serviceItem.service);
        }
        if (instantiateShared) {
            this._cache.set(key, instance);
        }
        return instance;
    };
    /**
     * Resolves a service, the resolved service is stored in the DI, subsequent requests
     * for this service will return the same instance.
     *
     * @param key Name of the service.
     * @returns {any}
     */
    DI.prototype.getShared = function (key) {
        return this.get(key, true);
    };
    /**
     * Registers a service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     * @param shared Whether to return always the same instance.
     */
    DI.prototype.set = function (key, service, shared) {
        if (shared === void 0) { shared = false; }
        this._services.set(key, {
            service: service,
            shared: shared
        });
    };
    /**
     * Registers an “always shared” service in the services container.
     *
     * @param key Name of the service.
     * @param service Factory method to resolve service instance.
     *
     * @returns {DI}
     */
    DI.prototype.setShared = function (key, service) {
        this.set(key, service, true);
        return this;
    };
    /**
     * Resets the internal default DI.
     *
     * @returns {DI}
     */
    DI.prototype.reset = function () {
        this._services.clear();
        return this;
    };
    /**
     * Instantiate a service using its factory method.
     *
     * @param service Name of the service.
     * @returns {any}
     * @private
     */
    DI.prototype._instantiate = function (service) {
        var instance = null;
        if (_.isFunction(service)) {
            instance = service(this);
        }
        else {
            instance = service;
        }
        if (instance && instance.setDI) {
            instance.setDI(this);
        }
        return instance;
    };
    return DI;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DI;

},{"./BaseObject":1,"./Data/Dictionary":5}],4:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
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
        /**
         * Get length of Collection. (same as method count)
         *
         * @returns {number}
         */
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get count of Collection. (same as property length)
     *
     * @returns {number}
     */
    Collection.prototype.count = function () {
        return this._data.length;
    };
    /**
     * Add (push) item to Collection.
     *
     * @param item Item to be added.
     */
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
    /**
     * Add multiple (concat) items to Collection.
     *
     * @param items Items to be added.
     */
    Collection.prototype.addMany = function (items) {
        var _this = this;
        // Remove existing items
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
    /**
     * Remove item from Collection.
     *
     * @param item Item to be removed.
     */
    Collection.prototype.remove = function (item) {
        var removedItems = [{
                item: item,
                index: this.indexOf(item)
            }];
        this._data = _.without(this._data, item);
        this.events.trigger(CollectionEvents.REMOVE, { operations: removedItems, clear: false });
        this.events.trigger(CollectionEvents.CHANGE);
    };
    /**
     * Remove multiple items from Collection.
     *
     * @param items Items to be removed.
     */
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
    /**
     * Remove items using properties.
     *
     * @param properties    Object containing key-value pairs.
     */
    Collection.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    /**
     * Replace an item with another item in Collection
     *
     * TODO: Discussion - Should there be a recursiveReplaceItem() that will replace duplicates?
     *
     * @param source    The item that gets replaced inside the Collection.
     * @param replacement The item that replaces the source item.
     * @returns {any}
     */
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
    /**
     * Clears the Collection.
     */
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
    /**
     * Iterates over all item in Collection, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    Collection.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    /**
     * The pluck method retrieves all of the collection values for a given key
     *
     * @param propertyName
     * @returns {Collection<string>|Collection}
     */
    Collection.prototype.pluck = function (propertyName) {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new Collection(data);
    };
    /**
     * Check whether the Collection is empty.
     *
     * @returns {boolean}
     */
    Collection.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    /**
     * Filter items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    Collection.prototype.filter = function (iterator) {
        return _.filter(this._data, iterator);
    };
    /**
     * Get the index of an item in collection.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    Collection.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    /**
     * Find item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    Collection.prototype.find = function (iterator) {
        return _.find(this._data, iterator);
    };
    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * Collection.where({author: "Shakespeare", year: 1611});
     *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
     * ````
     * @param properties Object containing key-value pairs.
     * @returns {T[]}
     */
    Collection.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    Collection.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    /**
     * Check if Collection contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    Collection.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    /**
     * Map values using an iterator returning a new instance
     * @param iterator
     * @param context
     * @returns {Collection<S>|Collection} returns new Collection
     */
    Collection.prototype.map = function (iterator, context) {
        var data = _.map(_.clone(this._data), iterator, context);
        return new Collection(data);
    };
    /**
     * Tranform values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection|Collection}
     */
    Collection.prototype.transform = function (iterator, context) {
        this._data = _.map(this._data, iterator, context);
        return this;
    };
    /**
     * Reject values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection} Returns new Collection
     */
    Collection.prototype.reject = function (iterator, context) {
        var data = _.reject(_.clone(this._data), iterator, context);
        return new Collection(data);
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    Collection.prototype.toArray = function () {
        return _.clone(this._data);
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
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

},{"../BaseObject":1,"../Events/EventEmitter":14}],5:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
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
    /**
     * Get value for key in dictionary.
     *
     * @param key Key to return value for.
     * @returns {any}
     */
    Dictionary.prototype.get = function (key) {
        var foundPair = this._getPair(key);
        return foundPair ? foundPair.value : null;
    };
    /**
     * Set value for key in dictionary.
     *
     * @param key Key to set item for.
     * @param value Value to set for given key.
     */
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
    /**
     * Remove value for key in dictionary.
     *
     * @param key   Key to remove item for.
     * @returns {null}
     */
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
    /**
     * Check if dictionary contains key.
     *
     * @param key Key to check against.
     * @returns {boolean}
     */
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
    /**
     * Iterate over each key/value pair in dictionary.
     *
     * @param iterator
     */
    Dictionary.prototype.each = function (iterator) {
        _.each(this._data, function (pair) {
            return iterator(pair.originalKey, pair.value);
        });
    };
    /**
     * Get all values in dictionary.
     *
     * @returns {V[]}
     */
    Dictionary.prototype.values = function () {
        return _.pluck(_.values(this._data), 'value');
    };
    /**
     * Get all keys in dictionary.
     *
     * @returns {K[]}
     */
    Dictionary.prototype.keys = function () {
        return _.pluck(_.values(this._data), 'originalKey');
    };
    /**
     * Count all pairs in dictionary.
     *
     * @returns {number}
     */
    Dictionary.prototype.count = function () {
        return this._itemCount;
    };
    /**
     * Check if dictionary is empty/
     *
     * @returns {boolean}
     */
    Dictionary.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    /**
     * Clear the dictionary.
     *
     * @returns {void}
     */
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
    /**
     * Get pair for key in dictionary.
     *
     * @param key Key to get pair for.
     * @returns {DictionaryKeyValuePairInterface}
     * @private
     */
    Dictionary.prototype._getPair = function (key) {
        var keyString = this._getKeyString(key);
        var foundPair = null;
        if (keyString != null && keyString != undefined) {
            foundPair = this._data[keyString];
        }
        return foundPair;
    };
    /**
     * Get string version for key in dictionary.
     *
     * @param key Key to get string for.
     * @returns {any}
     * @private
     */
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
    /**
     * Assign unique id to object.
     *
     * @param object Object to assign id to.
     * @private
     */
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

},{"../BaseObject":1,"../Events/EventEmitter":14}],6:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List_1 = require("./List");
var DynamicList = (function (_super) {
    __extends(DynamicList, _super);
    function DynamicList() {
        _super.apply(this, arguments);
    }
    DynamicList.prototype.setRange = function (start, items) {
        if (start < 0) {
            throw 'Start index less than 0 (zero) not allowed.';
        }
        var rangeStartIndex = start;
        var rangeEndIndex = start + items.length;
        var dataEndIndex = Math.max(this._data.length, 0);
        for (var dataIndex = Math.min(dataEndIndex, rangeStartIndex); dataIndex < rangeEndIndex; dataIndex++) {
            this._data[dataIndex] = items[dataIndex - rangeStartIndex];
            if (this._data[dataIndex] === undefined) {
                this._data[dataIndex] = null;
            }
        }
    };
    DynamicList.prototype.containsRange = function (start, length) {
        var rangeStartIndex = start;
        var rangeEndIndex = start + length;
        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {
            if (!this._data[dataIndex]) {
                return false;
            }
        }
        return true;
    };
    DynamicList.prototype.getRange = function (start, length) {
        var rangeStartIndex = start;
        var rangeEndIndex = start + length;
        var items = [];
        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {
            if (!this._data[dataIndex]) {
                return null;
            }
            items.push(this._data[dataIndex]);
        }
        return items;
    };
    return DynamicList;
}(List_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DynamicList;

},{"./List":7}],7:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
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
        /**
         * Get length of List. (same as method count)
         *
         * @returns {number}
         */
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get count of List. (same as property length)
     *
     * @returns {number}
     */
    List.prototype.count = function () {
        return this._data.length;
    };
    /**
     * Add (push) item to List.
     *
     * @param item Item to be added.
     */
    List.prototype.add = function (item) {
        var count = this._data.push(item);
        var addedItems = [{ item: item, index: count - 1 }];
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
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
    /**
     * Prepend item to list.
     *
     * @param item  Item to be inserted.
     */
    List.prototype.prepend = function (item) {
        this.insert(item, 0);
    };
    /**
     * Prepend multiple items to list.
     *
     * @param items Items to be inserted
     */
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
    /**
     * Insert an item at a certain index.
     *
     * @param item  Item to be inserted.
     * @param index Index to insert item at.
     */
    List.prototype.insert = function (item, index) {
        this._data.splice(index, 0, item);
        var addedItems = [{
                item: item,
                index: index
            }];
        this.events.trigger(ListEvents.ADD, { operations: addedItems });
        this.events.trigger(ListEvents.CHANGE);
    };
    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
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
    /**
     * Remove item at index
     * @param index
     */
    List.prototype.removeAt = function (index) {
        var item = this.get(index);
        this.remove(item);
    };
    /**
     * Remove multiple items from List.
     *
     * @param items Items to be removed.
     */
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
    /**
     * Remove items using properties.
     *
     * @param properties    Object containing key-value pairs.
     */
    List.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    /**
     * Replace an item with another item.
     *
     * @param source        The item that gets replaced inside the list.
     * @param replacement   The item that replaces the source item.
     * @returns {T}
     */
    List.prototype.replaceItem = function (source, replacement) {
        return this.replace(this.indexOf(source), replacement);
    };
    /**
     * Replace an item at a certain index.
     *
     * @param index         Index of the item that gets replaced.
     * @param replacement   The item the replaces the source item.
     * @returns {any}
     */
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
    /**
     * Clears the List.
     */
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
    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    List.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    List.prototype.map = function (iterator, context) {
        var data = _.map(this._data, iterator, context);
        return new List(data);
    };
    /**
     * The pluck method retrieves all of the list values for a given key
     *
     * @param propertyName
     * @returns {List<S>|List}
     */
    List.prototype.pluck = function (propertyName) {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new List(data);
    };
    /**
     * Check whether the List is empty.
     *
     * @returns {boolean}
     */
    List.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    /**
     * Get the first item from list.
     *
     * @returns {T}
     */
    List.prototype.first = function () {
        return _.first(this._data);
    };
    /**
     * Get the last item from list.
     * @returns {T}
     */
    List.prototype.last = function () {
        return _.last(this._data);
    };
    /**
     * Get an item at a specified index in list.
     *
     * @param index Index of the item to be returned.
     * @returns {T}
     */
    List.prototype.get = function (index) {
        return this._data[index];
    };
    /**
     * Get the index of an item in list.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    List.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    /**
     * Sort list.
     *
     * @returns {void}
     */
    List.prototype.sort = function (sortPredicate) {
        this._data = _.sortBy(this._data, sortPredicate);
        this.events.trigger(ListEvents.CHANGE);
    };
    /**
     * Find items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    List.prototype.find = function (iterator) {
        return _.filter(this._data, iterator);
    };
    /**
     * Find first item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    List.prototype.findFirst = function (iterator) {
        return _.find(this._data, iterator);
    };
    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * list.where({author: "Shakespeare", year: 1611});
     *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
     * ````
     * @param properties Object containing key-value pairs.
     * @returns {T[]}
     */
    List.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    List.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    /**
     * Check if List contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    List.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    List.prototype.toArray = function () {
        return _.clone(this._data);
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
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

},{"../BaseObject":1,"../Events/EventEmitter":14}],8:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
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

},{"../BaseObject":1,"../Events/EventEmitter":14}],9:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collection_1 = require("./Collection");
var ModelCollection = (function (_super) {
    __extends(ModelCollection, _super);
    function ModelCollection(modelClass, data) {
        _super.call(this, data);
        this._modelClass = modelClass;
    }
    ModelCollection.prototype.addManyData = function (data) {
        var _this = this;
        var createdModels = [];
        _.each(data, function (item) {
            createdModels.push(_this._instantiateModel(item));
        });
        return this.addMany(createdModels);
    };
    ModelCollection.prototype.addData = function (data) {
        return this.add(this._instantiateModel(data));
    };
    ModelCollection.prototype.contains = function (item) {
        var primaryKey = this._modelClass.primaryKey();
        var predicate = {};
        predicate[primaryKey] = item[primaryKey];
        return this.whereFirst(predicate) != null;
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    ModelCollection.prototype.all = function () {
        return _.clone(this._data);
    };
    /**
     * Convert Collection to array.
     *
     * @returns {any[]}
     */
    ModelCollection.prototype.toArray = function () {
        var result = [];
        this.each(function (item) {
            result.push(item.toObject());
        });
        return result;
    };
    ModelCollection.prototype._instantiateModel = function (data) {
        return new this._modelClass(data);
    };
    return ModelCollection;
}(Collection_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelCollection;

},{"./Collection":4}],10:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dictionary_1 = require("./Dictionary");
var ModelDictionary = (function (_super) {
    __extends(ModelDictionary, _super);
    function ModelDictionary(modelClass, data) {
        _super.call(this, data);
        this._modelClass = modelClass;
    }
    ModelDictionary.prototype.addManyData = function (data) {
        var _this = this;
        var addedItems = [];
        _.each(data, function (item) {
            var instance = _this._instantiateModel(item);
            _this.set(item[_this._modelClass.primaryKey()], instance);
            addedItems.push(instance);
        });
        return addedItems;
    };
    ModelDictionary.prototype.addData = function (data) {
        var instance = this._instantiateModel(data);
        this.set(data[this._modelClass.primaryKey()], instance);
        return instance;
    };
    ModelDictionary.prototype.toArray = function () {
        return _.map(_super.prototype.toArray.call(this), function (item) {
            return item.toObject();
        });
    };
    ModelDictionary.prototype.toObject = function () {
        return _.mapObject(_super.prototype.toObject, function (item) {
            return item.toObject();
        });
    };
    ModelDictionary.prototype._instantiateModel = function (data) {
        return new this._modelClass(data);
    };
    return ModelDictionary;
}(Dictionary_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelDictionary;

},{"./Dictionary":5}],11:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List_1 = require("./List");
var ModelList = (function (_super) {
    __extends(ModelList, _super);
    function ModelList() {
        _super.apply(this, arguments);
    }
    return ModelList;
}(List_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelList;

},{"./List":7}],12:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
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
    /**
     * Constructor function
     * @param data Data to populate list of instance with.
     * @param sortPredicate Predicate to sort list to.
     */
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
        /**
         * Get length of List. (same as method count)
         *
         * @returns {number}
         */
        get: function () {
            return this.count();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get count of List. (same as property length)
     *
     * @returns {number}
     */
    SortedList.prototype.count = function () {
        return this._data.length;
    };
    /**
     * Add (push) item to List.
     *
     * @param item Item to be added.
     */
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
    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
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
    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
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
    /**
     * Remove multiple items from List.
     *
     * @param items Items to be removed.
     */
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
    /**
     * Remove items using properties.
     *
     * @param properties    Object containing key-value pairs.
     */
    SortedList.prototype.removeWhere = function (properties) {
        this.removeMany(this.where(properties));
    };
    /**
     * Replace an item with another item.
     *
     * @param source        The item that gets replaced inside the list.
     * @param replacement   The item that replaces the source item.
     * @returns {T}
     */
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
    /**
     * Clears the List.
     */
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
    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    SortedList.prototype.each = function (iterator) {
        _.each(this._data, iterator);
    };
    SortedList.prototype.map = function (iterator, context) {
        var data = _.map(this._data, iterator, context);
        return new SortedList(data, this._sortPredicate, this._sortDirection);
    };
    /**
     * A convenient version of what is perhaps the most common use-case for map:
     * extracting a list of property values.
     *
     * @param propertyName Property name to pluck.
     * @returns {any[]}
     */
    SortedList.prototype.pluck = function (propertyName) {
        return _.pluck(this._data, propertyName);
    };
    /**
     * Check whether the List is empty.
     *
     * @returns {boolean}
     */
    SortedList.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    /**
     * Get the first item from list.
     *
     * @returns {T}
     */
    SortedList.prototype.first = function () {
        return _.first(this._data);
    };
    /**
     * Get the last item from list.
     * @returns {T}
     */
    SortedList.prototype.last = function () {
        return _.last(this._data);
    };
    /**
     * Get an item at a specified index in list.
     *
     * @param index Index of the item to be returned.
     * @returns {T}
     */
    SortedList.prototype.get = function (index) {
        return this._data[index];
    };
    /**
     * Get the index of an item in list.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    SortedList.prototype.indexOf = function (item) {
        return _.indexOf(this._data, item);
    };
    /**
     * Find items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    SortedList.prototype.find = function (iterator) {
        return _.filter(this._data, iterator);
    };
    /**
     * Find first item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    SortedList.prototype.findFirst = function (iterator) {
        return _.find(this._data, iterator);
    };
    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * list.where({author: "Shakespeare", year: 1611});
     *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
     * ````
     * @param properties Object containing key-value pairs.
     * @returns {T[]}
     */
    SortedList.prototype.where = function (properties) {
        return _.where(this._data, properties);
    };
    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    SortedList.prototype.whereFirst = function (properties) {
        return _.findWhere(this._data, properties);
    };
    /**
     * Check if List contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    SortedList.prototype.contains = function (item) {
        return _.contains(this._data, item);
    };
    /**
     * Convert List to array.
     *
     * @returns {any[]}
     */
    SortedList.prototype.toArray = function () {
        return _.clone(this._data);
    };
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    SortedList.prototype.all = function () {
        return _.clone(this._data);
    };
    SortedList.prototype.clone = function () {
        return new SortedList(_.clone(this._data), this._sortPredicate);
    };
    /**
     * Resort list.
     *
     * @returns {void}
     */
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
    /** Set sortPredicate along with the sort direction
     *
     * @param predicate Predicate to set.
     * @param direction Direction to sort list to (ASC&DESC)
     */
    SortedList.prototype.setSortPredicate = function (predicate, direction) {
        if (direction === void 0) { direction = SortedListDirection.ASCENDING; }
        this._sortPredicate = predicate;
        this._sortDirection = direction;
        this.sort();
    };
    /**
     * Get the current sortPredicate
     * @returns {any}
     */
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

},{"../BaseObject":1,"../Events/EventEmitter":14}],13:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var EventEmitter_1 = require("../Events/EventEmitter");
var Events;
(function (Events) {
    Events.START = "start";
    Events.PAUSE = "pause";
    Events.RESUME = "resume";
    Events.STOP = "stop";
    Events.TICK = "tick";
})(Events = exports.Events || (exports.Events = {}));
var Timer = (function (_super) {
    __extends(Timer, _super);
    /**
     * Constructor function
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats Whether the timer should repeat.
     */
    function Timer(timeout, tickCallback, repeats) {
        if (tickCallback === void 0) { tickCallback = null; }
        if (repeats === void 0) { repeats = false; }
        _super.call(this);
        this.events = new EventEmitter_1.default();
        this.timeout = timeout;
        this.tickCallback = tickCallback;
        this.repeats = repeats;
    }
    Object.defineProperty(Timer.prototype, "tickCount", {
        get: function () {
            return this._tickCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "elapsedTime", {
        get: function () {
            if (!this._startDate) {
                return null;
            }
            return new Date().getTime() - this._startDate.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "isStarted", {
        get: function () {
            return this._isStarted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Start timer if not already started.
     *
     * @returns {void}
     */
    Timer.prototype.start = function () {
        if (this._isStarted) {
            return;
        }
        this._tickCount = 0;
        this._startDate = new Date();
        this.events.trigger(Events.START, {
            startDate: this._startDate
        });
        this.resume();
    };
    /**
     * Resume timer if not running.
     *
     * @returns {void}
     */
    Timer.prototype.resume = function () {
        if (this._isStarted) {
            return;
        }
        this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
        this._internalTimerIsInterval = this.repeats;
        this._isStarted = true;
        this.events.trigger(Events.RESUME, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    };
    /**
     * Pause timer if it's running.
     *
     * @returns {void}
     */
    Timer.prototype.pause = function () {
        if (!this._isStarted) {
            return;
        }
        (this._internalTimerIsInterval ? clearInterval : clearTimeout)(this._internalTimer);
        this._internalTimer = null;
        this._isStarted = false;
        this.events.trigger(Events.PAUSE, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    };
    /**
     * Restart the timer.
     *
     * @returns {void}
     */
    Timer.prototype.restart = function () {
        this.stop();
        this.start();
    };
    /**
     * Stop the timer.
     *
     * @returns {void}
     */
    Timer.prototype.stop = function () {
        var eventParams = {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        };
        this.reset();
        this.events.trigger(Events.STOP, eventParams);
    };
    /**
     * Reset the timer. The timer will pause.
     *
     * @returns {void}
     */
    Timer.prototype.reset = function () {
        if (this._isStarted) {
            this.pause();
        }
        this._tickCount = 0;
        this._startDate = null;
    };
    /**
     * Start the timer.
     *
     * @param timeout Time (in milliseconds) for the timer to execute.
     * @param tickCallback Callback to call when timer gets executed.
     * @param repeats   Whether the timer should repeat.
     * @returns {Timer}
     */
    Timer.start = function (timeout, tickCallback, repeats) {
        if (tickCallback === void 0) { tickCallback = null; }
        if (repeats === void 0) { repeats = false; }
        var timer = new this(timeout, tickCallback, repeats);
        timer.start();
        return timer;
    };
    /**
     * Increases tick count.
     * Calls tick callback.
     *
     * @private
     */
    Timer.prototype._timerTick = function () {
        this._tickCount++;
        if (this.tickCallback) {
            this.tickCallback(this._tickCount, this.elapsedTime);
        }
        this.events.trigger(Events.TICK, {
            startDate: this._startDate,
            tickCount: this._tickCount,
            elapsedTime: this.elapsedTime
        });
    };
    return Timer;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Timer;

},{"../BaseObject":1,"../Events/EventEmitter":14}],14:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Event = (function (_super) {
    __extends(Event, _super);
    /**
     * Constructor function.
     *
     * @param topic Topic name of event.
     * @param _params Params that will be passed along event.
     * @param caller Context that trigger the original event.
     */
    function Event(topic, _params, caller) {
        _super.call(this);
        this.topic = topic;
        this._params = _params;
        this.caller = caller;
        this.isStopped = false;
    }
    Object.defineProperty(Event.prototype, "params", {
        /**
         * Magic getter for params.
         *
         * @returns {T}
         */
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Stop the event from being called.
     *
     * @returns {void}
     */
    Event.prototype.stop = function () {
        this.isStopped = true;
    };
    return Event;
}(BaseObject_1.default));
exports.Event = Event;
var EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    /**
     * Constructor function
     *
     * @returns {EventEmitter}
     */
    function EventEmitter() {
        _super.call(this);
        this._eventCallbacks = {};
    }
    /**
     * Subscribe to triggered events.
     * @param topics        Which topics to listen, separated by space
     * @param callback      Callback function to execute on trigger.
     * @param context       Context for the callback
     * @param once          Run the callback for emitted event exactly one
     * @returns             {EventEmitter}
     */
    EventEmitter.prototype.on = function (topics, callback, context, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        _.each(topics.split(' '), function (topic) {
            // Get or create event collection
            var callbackArray = _this._eventCallbacks[topic];
            if (!callbackArray) {
                callbackArray = [];
                _this._eventCallbacks[topic] = callbackArray;
            }
            // Push callback
            callbackArray.push({
                topic: topic,
                callback: callback,
                context: context,
                once: once
            });
        });
        return this;
    };
    /**
     * Subscribe to emitted topics exactly once
     * @param topics        Which topics to listen, separated by space
     * @param callback      Callback function to execute on trigger.
     * @param context       Context for the callback
     * @returns             {EventEmitter}
     */
    EventEmitter.prototype.once = function (topics, callback, context) {
        return this.on.apply(this, [topics, callback, context, true]);
    };
    /**
     * Unsubscribe from published topics.
     * @param topics        Which topics to stop listening, seperated by space
     * @param callback      Callback function executed on trigger.
     * @param context       Context for the callback
     * @returns             {EventEmitter}
     */
    EventEmitter.prototype.off = function (topics, callback, context) {
        var _this = this;
        _.each(topics.split(' '), function (topic) {
            var callbackArray = _this._eventCallbacks[topic];
            if (!callbackArray) {
                return;
            }
            if (!callback) {
                delete _this._eventCallbacks[topic];
                return;
            }
            var callbacksToRemove = _.where(callbackArray, context ? {
                callback: callback,
                context: context
            } : { callback: callback });
            callbackArray = _.difference(callbackArray, callbacksToRemove);
            if (callbackArray.length == 0) {
                delete _this._eventCallbacks[topic];
            }
            else {
                _this._eventCallbacks[topic] = callbackArray;
            }
        });
        return this;
    };
    /**
     * Publish event for a topic.
     * TODO: Generic for param bag.
     * ````
     * var emitter = new TSCore.Event.EventEmitter();
     * emitter.trigger('topic', arg1, arg2);
     * ````
     * @param topic         Which topic to trigger.
     * @param args          Arguments to pass along event.
     * @returns             {EventEmitter}
     */
    EventEmitter.prototype.trigger = function (topic, params, caller) {
        var _this = this;
        var callbackArray = this._eventCallbacks[topic];
        if (!callbackArray) {
            return;
        }
        // create event
        var event = new Event(topic, params, caller);
        _.each(callbackArray, function (item) {
            if (event.isStopped) {
                return;
            }
            item.callback.apply(item.context || _this, [event]);
            if (item.once) {
                _this.off(topic, item.callback, item.context);
            }
        });
        return this;
    };
    /**
     * Reset all subscriptions.
     *
     * @returns {EventEmitter}
     */
    EventEmitter.prototype.reset = function () {
        this._eventCallbacks = {};
        return this;
    };
    return EventEmitter;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventEmitter;

},{"../BaseObject":1}],15:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var ArgumentException = (function (_super) {
    __extends(ArgumentException, _super);
    function ArgumentException() {
        _super.apply(this, arguments);
    }
    return ArgumentException;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArgumentException;

},{"../BaseObject":1}],16:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Exception = (function (_super) {
    __extends(Exception, _super);
    function Exception(message, code, data) {
        if (code === void 0) { code = 0; }
        if (data === void 0) { data = null; }
        _super.call(this);
        this.message = message;
        this.code = code;
        this.data = data;
    }
    Object.defineProperty(Exception.prototype, "name", {
        get: function () {
            return typeof this;
        },
        enumerable: true,
        configurable: true
    });
    Exception.prototype.toString = function () {
        return this.name + ' (' + this.code + '): ' + this.message;
    };
    return Exception;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Exception;

},{"../BaseObject":1}],17:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Point = (function (_super) {
    __extends(Point, _super);
    /**
     * Constructor function
     * @param x Position value for x. Defaults to zero.
     * @param y Position value for y. Defaults to zero.
     */
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    /**
     * Translate points values.
     *
     * @param x Value to increase x position with.
     * @param y Value to increase y position with.
     */
    Point.prototype.translate = function (x, y) {
        this.x += x;
        this.y += y;
    };
    return Point;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Point;

},{"../BaseObject":1}],18:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Point_1 = require("./Point");
var Size_1 = require("./Size");
var Rect = (function (_super) {
    __extends(Rect, _super);
    /**
     * Constructor function.
     *
     * @param x Origin position value for x.
     * @param y Origin position value for y.
     * @param width Value for width.
     * @param height Value for height.
     */
    function Rect(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        _super.call(this);
        this.origin = new Point_1.default(x, y);
        this.size = new Size_1.default(width, height);
    }
    Object.defineProperty(Rect.prototype, "x", {
        /**
         * Magic getter for x origin position.
         *
         * @returns {number}
         */
        get: function () {
            return this.origin.x;
        },
        /**
         * Magic setter for x origin position.
         *
         * @param x Origin position value for x.
         */
        set: function (x) {
            this.origin.x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y", {
        /**
         * Magic getter for y origin position.
         *
         * @returns {number}
         */
        get: function () {
            return this.origin.y;
        },
        /**
         * Magic setter for y origin position.
         *
         * @param y Origin position value for y.
         */
        set: function (y) {
            this.origin.y = y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "width", {
        /**
         * Magic getter for width.
         *
         * @returns {number}
         */
        get: function () {
            return this.size.width;
        },
        /**
         * Magic setter for width.
         *
         * @param width Value for width.
         */
        set: function (width) {
            this.size.width = width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "height", {
        /**
         * Magic getter for height.
         *
         * @returns {number}
         */
        get: function () {
            return this.size.height;
        },
        /**
         * Magic setter for height.
         *
         * @param height Value for height.
         */
        set: function (height) {
            this.size.height = height;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get point instance for center position of rect.
     *
     * @returns {Point}
     */
    Rect.prototype.center = function () {
        return new Point_1.default(this.origin.x + this.size.halfWidth(), this.origin.y + this.size.halfHeight());
    };
    /**
     * Get point instance for topLeft position of rect.
     *
     * @returns {Point}
     */
    Rect.prototype.topLeft = function () {
        return new Point_1.default(this.origin.x, this.origin.y);
    };
    /**
     * Get point instance for bottomLeft position of rect.
     *
     * @returns {Point}
     */
    Rect.prototype.bottomLeft = function () {
        return new Point_1.default(this.origin.x, this.origin.y + this.size.height);
    };
    /**
     * Get point instance for topRight position of rect.
     *
     * @returns {Point}
     */
    Rect.prototype.topRight = function () {
        return new Point_1.default(this.origin.x + this.size.width, this.origin.y);
    };
    /**
     * Get point instance for bottomRight position of rect.
     *
     * @returns {Point}
     */
    Rect.prototype.bottomRight = function () {
        return new Point_1.default(this.origin.x + this.size.width, this.origin.y + this.size.height);
    };
    /**
     * Get the half of rect's width.
     *
     * @returns {number}
     */
    Rect.prototype.halfWidth = function () {
        return this.size.halfWidth();
    };
    /**
     * Get the half of rect's height.
     *
     * @returns {number}
     */
    Rect.prototype.halfHeight = function () {
        return this.size.halfHeight();
    };
    /**
     * Check if rect's position contains point's position.
     *
     * @param point
     * @returns {boolean}
     */
    Rect.prototype.containsPoint = function (point) {
        var topLeft = this.topLeft();
        var bottomRight = this.bottomRight();
        return point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y;
    };
    /**
     * Check if rect's position contains another rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    Rect.prototype.containsRect = function (rect) {
        return this.containsPoint(rect.topLeft()) && this.containsPoint(rect.bottomRight());
    };
    /**
     * Check if rect's position intersects rect's position.
     *
     * @param rect
     * @returns {boolean}
     */
    Rect.prototype.intersectsRect = function (rect) {
        return this.containsPoint(rect.topLeft()) || this.containsPoint(rect.bottomLeft()) || this.containsPoint(rect.topRight()) || this.containsPoint(rect.bottomRight());
    };
    /**
     * Inset rect.
     *
     * @param top Value for rect's top position.
     * @param right Value for rect's right position.
     * @param bottom Value for rect's bottom position.
     * @param left Value for rect's left position.
     *
     * @returns {Rect}
     */
    Rect.prototype.inset = function (top, right, bottom, left) {
        this.origin.x += left;
        this.origin.y += top;
        this.size.width -= right;
        this.size.height -= bottom;
        return this;
    };
    /**
     * Inset center of rect.
     *
     * @param horizontal Value for rect's horizontal position.
     * @param vertical Value for rect's vertical position.
     *
     * @returns {Rect}
     */
    Rect.prototype.insetCenter = function (horizontal, vertical) {
        this.inset(vertical / 2, horizontal / 2, vertical / 2, horizontal / 2);
        return this;
    };
    /**
     * Expand rect.
     * @param horizontal Value for rect's horizontal expand position.
     * @param vertical Value for rect's vertical expand position.
     *
     * @returns {Rect}
     */
    Rect.prototype.expand = function (horizontal, vertical) {
        this.insetCenter(-horizontal, -vertical);
        return this;
    };
    /**
     * Reduce rect.
     *
     * @param horizontal Value for rect's horizontal reduce position.
     * @param vertical Value for rect's vertical reduce position.
     *
     * @returns {Rect}
     */
    Rect.prototype.reduce = function (horizontal, vertical) {
        this.insetCenter(horizontal, vertical);
        return this;
    };
    return Rect;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rect;

},{"../BaseObject":1,"./Point":17,"./Size":19}],19:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Size = (function (_super) {
    __extends(Size, _super);
    /**
     * Constructor function.
     *
     * @param width Width value of size.
     * @param height Height value of size.
     */
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        _super.call(this);
        this.width = width;
        this.height = height;
    }
    /**
     * Return the half of size's width.
     *
     * @returns {number}
     */
    Size.prototype.halfWidth = function () {
        return this.width / 2;
    };
    /**
     * Return the half of size's height.
     * @returns {number}
     */
    Size.prototype.halfHeight = function () {
        return this.height / 2;
    };
    return Size;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Size;

},{"../BaseObject":1}],20:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Dictionary_1 = require("../Data/Dictionary");
(function (LogLevels) {
    LogLevels[LogLevels["LOG"] = 0] = "LOG";
    LogLevels[LogLevels["INFO"] = 1] = "INFO";
    LogLevels[LogLevels["WARN"] = 2] = "WARN";
    LogLevels[LogLevels["ERROR"] = 3] = "ERROR";
    LogLevels[LogLevels["FATAL"] = 4] = "FATAL";
})(exports.LogLevels || (exports.LogLevels = {}));
var LogLevels = exports.LogLevels;
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger(parent, tag) {
        _super.call(this);
        this._parent = parent;
        this._tag = tag;
        this._streams = this._parent ? this._parent.getStreams() : new Dictionary_1.default();
    }
    /**
     * Return a child logger with a pre-configured tag
     *
     * @param tag
     */
    Logger.prototype.child = function (tag) {
        return new Logger(this, tag);
    };
    /**
     * Set ILogStream instance for key.
     *
     * @param key       Name for logger.
     * @param stream    StreamInterface instance.
     * @param level     Minimal log level for this stream
     */
    Logger.prototype.addStream = function (key, stream, level) {
        if (level === void 0) { level = LogLevels.LOG; }
        this._streams.set(key, {
            level: level,
            stream: stream
        });
    };
    /**
     * Unset ILogStream instance for key.
     *
     * @param key   Name for logger.
     */
    Logger.prototype.removeStream = function (key) {
        this._streams.remove(key);
    };
    /**
     * Get all streams
     */
    Logger.prototype.getStreams = function () {
        return this._streams;
    };
    /**
     * Execute log streams with LogLevels.LOG
     *
     * @returns {void}
     */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LogLevels.LOG, args);
    };
    /**
     * Execute log streams with LogLevels.INFO
     *
     * @returns {void}
     */
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LogLevels.INFO, args);
    };
    /**
     * Execute log streams with LogLevels.WARN
     *
     * @returns {void}
     */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LogLevels.WARN, args);
    };
    /**
     * Execute log streams with LogLevels.INFO
     *
     * @returns {void}
     */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LogLevels.ERROR, args);
    };
    /**
     * Execute log streams with LogLevels.FATAL
     *
     * @returns {void}
     */
    Logger.prototype.fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this._exec(LogLevels.FATAL, args);
    };
    Logger.prototype._exec = function (level, args) {
        var tag = this._tag || args.shift();
        this._streams.each(function (key, streamEntry) {
            if (level >= streamEntry.level) {
                streamEntry.stream.exec({
                    level: level,
                    tag: tag,
                    args: args,
                    time: new Date().getTime()
                });
            }
        });
    };
    return Logger;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logger;

},{"../BaseObject":1,"../Data/Dictionary":5}],21:[function(require,module,exports){
///<reference path="../../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Logger_1 = require("../Logger");
var BaseObject_1 = require("../../BaseObject");
var Console = (function (_super) {
    __extends(Console, _super);
    function Console(_console, colorsEnabled) {
        if (colorsEnabled === void 0) { colorsEnabled = true; }
        _super.call(this);
        this._console = _console;
        this.colorsEnabled = colorsEnabled;
    }
    Console.prototype.exec = function (options) {
        var method;
        switch (options.level) {
            case Logger_1.LogLevels.LOG:
                method = 'log';
                break;
            case Logger_1.LogLevels.INFO:
                method = 'info';
                break;
            case Logger_1.LogLevels.WARN:
                method = 'warn';
                break;
            case Logger_1.LogLevels.ERROR:
                method = 'error';
                break;
        }
        var optionArgs = options.args || [];
        var args = [];
        if (this.colorsEnabled) {
            var tagBackgroundColor = this._generateHex(options.tag);
            var tagTextColor = this._getIdealTextColor(tagBackgroundColor);
            args = ['%c ' + options.tag + ' ', 'background: ' + tagBackgroundColor + '; color: ' + tagTextColor + ';'].concat(optionArgs);
        }
        else {
            args = [options.tag].concat(optionArgs);
        }
        this._console[method].apply(this._console, args);
    };
    Console.prototype._generateHex = function (input) {
        // str to hash
        for (var i = 0, hash = 0; i < input.length; hash = input.charCodeAt(i++) + ((hash << 5) - hash))
            ;
        // int/hash to hex
        for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2))
            ;
        return colour;
    };
    Console.prototype._getIdealTextColor = function (bgColor) {
        var r = bgColor.substring(1, 3);
        var g = bgColor.substring(3, 5);
        var b = bgColor.substring(5, 7);
        var components = {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
        var nThreshold = 105;
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    };
    return Console;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Console;

},{"../../BaseObject":1,"../Logger":20}],22:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Base64 = (function (_super) {
    __extends(Base64, _super);
    function Base64() {
        _super.apply(this, arguments);
    }
    Base64.prototype.encode = function (input) {
        if (!input) {
            return input;
        }
        var keyStr = Base64.keyStr;
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    };
    Base64.prototype.decode = function (input) {
        if (!input) {
            return input;
        }
        var keyStr = Base64.keyStr;
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    };
    Base64.keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return Base64;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Base64;

},{"../BaseObject":1}],23:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var Enum = (function () {
    function Enum() {
    }
    Enum.names = function (e) {
        return Object.keys(e).filter(function (v) { return isNaN(parseInt(v, 10)); });
    };
    Enum.values = function (e) {
        return Object.keys(e).map(function (v) { return parseInt(v, 10); }).filter(function (v) { return !isNaN(v); });
    };
    Enum.object = function (e) {
        return Enum.values(e).map(function (v) {
            return {
                name: e[v],
                value: v
            };
        });
    };
    return Enum;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Enum;

},{}],24:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Random = (function (_super) {
    __extends(Random, _super);
    function Random() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Random, "uuidLut", {
        get: function () {
            if (!Random._uuidLut) {
                var lut = [];
                for (var i = 0; i < 256; i++) {
                    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
                }
                Random._uuidLut = lut;
            }
            return Random._uuidLut;
        },
        enumerable: true,
        configurable: true
    });
    Random.number = function (min, max) {
        return Math.floor((Math.random() * max) + min);
    };
    Random.uniqueNumber = function () {
        return parseInt(new Date().getTime() + '' + Random.number(0, 100));
    };
    Random.bool = function () {
        return Random.number(0, 1) == 1;
    };
    Random.string = function (length, characters) {
        if (length === void 0) { length = 10; }
        if (characters === void 0) { characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
        var result = '';
        for (var i = length; i > 0; --i)
            result += characters[Math.round(Math.random() * (characters.length - 1))];
        return result;
    };
    Random.uuid = function () {
        var lut = this.uuidLut;
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };
    return Random;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Random;

},{"../BaseObject":1}],25:[function(require,module,exports){
///<reference path="../../typings/main.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        _super.apply(this, arguments);
    }
    /**
     * Escape a html string.
     *
     * @param input String to be parsed.
     * @returns {string}
     */
    Text.escapeHtml = function (input) {
        var entityMap = Text.HtmlEntityMap;
        return input.replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };
    /**
     * Truncate strings length with a suffix for a given length.
     *
     * @param input             String to be truncated.
     * @param maxLength         Length of the truncated string.
     * @param suffix            Suffix to be added at the end of a string. Defaults to '...'.
     * @returns {string}
     */
    Text.truncate = function (input, maxLength, suffix) {
        if (suffix === void 0) { suffix = '...'; }
        if (input.length <= length) {
            return input;
        }
        return input.substring(0, length) + suffix;
    };
    /**
     * Concatenate parts together.
     *
     * @param parts             Parts that get concatenated.
     * @param seperator         Separator value that by which the parts get concatenated.
     * @param lastSeparator     Last separator to concatenate parts with. Defaults to separator.
     * @returns {string}
     */
    Text.concatenate = function (parts, seperator, lastSeparator) {
        if (seperator === void 0) { seperator = ', '; }
        if (lastSeparator === void 0) { lastSeparator = seperator; }
        var result = '';
        _.each(parts, function (part, index) {
            if (index > 0) {
                if (index == parts.length - 1) {
                    result += lastSeparator;
                }
                else {
                    result += seperator;
                }
            }
            result += part;
        });
        return result;
    };
    /**
     * Zero pad a string.
     * TODO: What if input.length is greater than width?
     *
     * @param input     String to be padded.
     * @param width     Total length of the string after being padded.
     * @param zero      String to pad input with. Defaults to "0".
     * @returns {string}
     */
    Text.zeroPad = function (input, width, zero) {
        if (zero === void 0) { zero = '0'; }
        return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
    };
    /**
     * Make a string's first character uppercase.
     *
     * @param input String to be parsed.
     * @returns {string}
     */
    Text.ucFirst = function (input) {
        if (input == '') {
            return input;
        }
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
    /**
     * Check if string starts with a certain string.
     *
     * @param source    Source string.
     * @param search    String to search for.
     * @returns {boolean}
     */
    Text.startsWith = function (source, search) {
        return source.slice(0, search.length) == search;
    };
    /**
     * Check if string ends with a certain string.
     *
     * @param source    Source string.
     * @param search    String to search for.
     * @returns {boolean}
     */
    Text.endsWith = function (source, search) {
        return source.slice(-search.length) == search;
    };
    Text.HtmlEntityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return Text;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;

},{"../BaseObject":1}],26:[function(require,module,exports){
"use strict";
var Collection_1 = require("./src/Data/Collection");
exports.Collection = Collection_1.default;
var Dictionary_1 = require("./src/Data/Dictionary");
exports.Dictionary = Dictionary_1.default;
var DynamicList_1 = require("./src/Data/DynamicList");
exports.DynamicList = DynamicList_1.default;
var List_1 = require("./src/Data/List");
exports.List = List_1.default;
var Model_1 = require("./src/Data/Model");
exports.Model = Model_1.default;
var ModelCollection_1 = require("./src/Data/ModelCollection");
exports.ModelCollection = ModelCollection_1.default;
var ModelDictionary_1 = require("./src/Data/ModelDictionary");
exports.ModelDictionary = ModelDictionary_1.default;
var ModelList_1 = require("./src/Data/ModelList");
exports.ModelList = ModelList_1.default;
var SortedList_1 = require("./src/Data/SortedList");
exports.SortedList = SortedList_1.default;
var Timer_1 = require("./src/DateTime/Timer");
exports.Timer = Timer_1.default;
var EventEmitter_1 = require("./src/Events/EventEmitter");
exports.EventEmitter = EventEmitter_1.default;
var ArgumentException_1 = require("./src/Exceptions/ArgumentException");
exports.ArgumentException = ArgumentException_1.default;
var Exception_1 = require("./src/Exceptions/Exception");
exports.Exception = Exception_1.default;
var Point_1 = require("./src/Geometry/Point");
exports.Point = Point_1.default;
var Rect_1 = require("./src/Geometry/Rect");
exports.Rect = Rect_1.default;
var Size_1 = require("./src/Geometry/Size");
exports.Size = Size_1.default;
var Logger_1 = require("./src/Logger/Logger");
exports.Logger = Logger_1.default;
var Console_1 = require("./src/Logger/Streams/Console");
exports.Console = Console_1.default;
var Base64_1 = require("./src/Utils/Base64");
exports.Base64 = Base64_1.default;
var Enum_1 = require("./src/Utils/Enum");
exports.Enum = Enum_1.default;
var Random_1 = require("./src/Utils/Random");
exports.Random = Random_1.default;
var Text_1 = require("./src/Utils/Text");
exports.Text = Text_1.default;
var BaseObject_1 = require("./src/BaseObject");
exports.BaseObject = BaseObject_1.default;
var Config_1 = require("./src/Config");
exports.Config = Config_1.default;
var DI_1 = require("./src/DI");
exports.DI = DI_1.default;

},{"./src/BaseObject":1,"./src/Config":2,"./src/DI":3,"./src/Data/Collection":4,"./src/Data/Dictionary":5,"./src/Data/DynamicList":6,"./src/Data/List":7,"./src/Data/Model":8,"./src/Data/ModelCollection":9,"./src/Data/ModelDictionary":10,"./src/Data/ModelList":11,"./src/Data/SortedList":12,"./src/DateTime/Timer":13,"./src/Events/EventEmitter":14,"./src/Exceptions/ArgumentException":15,"./src/Exceptions/Exception":16,"./src/Geometry/Point":17,"./src/Geometry/Rect":18,"./src/Geometry/Size":19,"./src/Logger/Logger":20,"./src/Logger/Streams/Console":21,"./src/Utils/Base64":22,"./src/Utils/Enum":23,"./src/Utils/Random":24,"./src/Utils/Text":25}]},{},[26])(26)
});