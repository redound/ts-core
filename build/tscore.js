var TSCore;
(function (TSCore) {
    var Events;
    (function (Events) {
        var Event = (function () {
            function Event(topic, _params, caller) {
                this.topic = topic;
                this._params = _params;
                this.caller = caller;
                this.isStopped = false;
            }
            Object.defineProperty(Event.prototype, "params", {
                get: function () {
                    return this._params;
                },
                enumerable: true,
                configurable: true
            });
            Event.prototype.stop = function () {
                this.isStopped = true;
            };
            return Event;
        })();
        Events.Event = Event;
    })(Events = TSCore.Events || (TSCore.Events = {}));
})(TSCore || (TSCore = {}));
/// <reference path="Event.ts" />
var TSCore;
(function (TSCore) {
    var Events;
    (function (Events) {
        var EventEmitter = (function () {
            function EventEmitter() {
                this._eventCallbacks = {};
                return this;
            }
            EventEmitter.prototype.on = function (topics, callback, context, once) {
                var _this = this;
                if (once === void 0) { once = false; }
                _.each(topics.split(' '), function (topic) {
                    var callbackArray = _this._eventCallbacks[topic];
                    if (!callbackArray) {
                        callbackArray = [];
                        _this._eventCallbacks[topic] = callbackArray;
                    }
                    callbackArray.push({
                        topic: topic,
                        callback: callback,
                        context: context,
                        once: once
                    });
                });
                return this;
            };
            EventEmitter.prototype.once = function (topics, callback, context) {
                return this.on.apply(this, [topics, callback, context, true]);
            };
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
                    var callbacksToRemove = _.where(callbackArray, context ? { callback: callback, context: context } : { callback: callback });
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
            EventEmitter.prototype.trigger = function (topic, params, caller) {
                var _this = this;
                var callbackArray = this._eventCallbacks[topic];
                if (!callbackArray) {
                    return;
                }
                var event = new Events.Event(topic, params, caller);
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
            EventEmitter.prototype.reset = function () {
                this._eventCallbacks = {};
                return this;
            };
            return EventEmitter;
        })();
        Events.EventEmitter = EventEmitter;
    })(Events = TSCore.Events || (TSCore.Events = {}));
})(TSCore || (TSCore = {}));
/// <reference path="Events/EventEmitter.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSCore;
(function (TSCore) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config(data) {
            _super.call(this);
            if (data) {
                this.load(data);
            }
        }
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
        Config.prototype.load = function (value) {
            this._data = value;
            return this;
        };
        Config.prototype.has = function (key) {
            return (this.get(key) !== null);
        };
        Config.prototype.clear = function (key) {
            if (key) {
                this._cache = this._cache || {};
                this._data = this._data || {};
                if (!this.has(key)) {
                    return this;
                }
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
    })(TSCore.Events.EventEmitter);
    TSCore.Config = Config;
})(TSCore || (TSCore = {}));
/// <reference path="../Events/EventEmitter.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Dictionary = (function (_super) {
            __extends(Dictionary, _super);
            function Dictionary(data) {
                _super.call(this);
                this._itemCount = 0;
                this.events = new TSCore.Events.EventEmitter();
                this._data = data || {};
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
                    value: value
                };
                if (!alreadyExisted) {
                    this._itemCount++;
                }
                this.events.trigger(TSCore.Data.Dictionary.Events.ADD, { key: key, value: value });
                this.events.trigger(TSCore.Data.Dictionary.Events.CHANGE);
            };
            Dictionary.prototype.remove = function (key) {
                var removedItem = null;
                var foundPair = this._getPair(key);
                if (foundPair) {
                    delete this._data[foundPair.key];
                    removedItem = foundPair.value;
                    this._itemCount--;
                    this.events.trigger(TSCore.Data.Dictionary.Events.REMOVE, { key: key, value: removedItem });
                    this.events.trigger(TSCore.Data.Dictionary.Events.CHANGE);
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
                    return iterator(pair.key, pair.value);
                });
            };
            Dictionary.prototype.values = function () {
                return _.pluck(_.values(this._data), 'value');
            };
            Dictionary.prototype.keys = function () {
                return _.pluck(_.values(this._data), 'key');
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
                this.events.trigger(TSCore.Data.Dictionary.Events.CLEAR);
                this.events.trigger(TSCore.Data.Dictionary.Events.CHANGE);
            };
            Dictionary.prototype.toObject = function () {
                var result = {};
                _.each(_.values(this._data), function (item) {
                    result[item.key] = item.value;
                });
                return result;
            };
            Dictionary.prototype.toArray = function () {
                return this.values();
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
        })(TSCore.Events.EventEmitter);
        Data.Dictionary = Dictionary;
        var Dictionary;
        (function (Dictionary) {
            var Events;
            (function (Events) {
                Events.ADD = "add";
                Events.CHANGE = "change";
                Events.REMOVE = "remove";
                Events.CLEAR = "clear";
            })(Events = Dictionary.Events || (Dictionary.Events = {}));
        })(Dictionary = Data.Dictionary || (Data.Dictionary = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Data/Dictionary.ts" />
var TSCore;
(function (TSCore) {
    var Dictionary = TSCore.Data.Dictionary;
    var DI = (function () {
        function DI() {
            this._services = new Dictionary();
            this._cache = new Dictionary();
        }
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
        DI.prototype.getShared = function (key) {
            return this.get(key, true);
        };
        DI.prototype.set = function (key, service, shared) {
            if (shared === void 0) { shared = false; }
            this._services.set(key, {
                service: service,
                shared: shared
            });
        };
        DI.prototype.setShared = function (key, service) {
            this.set(key, service, true);
            return this;
        };
        DI.prototype.reset = function () {
            this._services.clear();
            return this;
        };
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
    })();
    TSCore.DI = DI;
})(TSCore || (TSCore = {}));
/// <reference path="../Events/EventEmitter.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection = (function () {
            function Collection(data) {
                this.events = new TSCore.Events.EventEmitter();
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
                this.events.trigger(TSCore.Data.Collection.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
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
                    this.events.trigger(TSCore.Data.Collection.Events.ADD, { items: itemsToAdd });
                    this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
                }
                return itemsToAdd;
            };
            Collection.prototype.remove = function (item) {
                this._data = _.without(this._data, item);
                this.events.trigger(TSCore.Data.Collection.Events.REMOVE, { items: [item] });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
            };
            Collection.prototype.removeMany = function (items) {
                this._data = _.difference(this._data, items);
                this.events.trigger(TSCore.Data.Collection.Events.REMOVE, { items: items });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
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
                this.events.trigger(TSCore.Data.Collection.Events.REPLACE, { source: source, replacement: replacement });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
                return currentItem;
            };
            Collection.prototype.clear = function () {
                this._data = [];
                this.events.trigger(TSCore.Data.Collection.Events.REMOVE, { items: this.toArray() });
                this.events.trigger(TSCore.Data.Collection.Events.CLEAR);
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
            };
            Collection.prototype.each = function (iterator) {
                _.each(this._data, iterator);
            };
            Collection.prototype.pluck = function (propertyName) {
                return _.pluck(this._data, propertyName);
            };
            Collection.prototype.isEmpty = function () {
                return this.count() === 0;
            };
            Collection.prototype.find = function (iterator) {
                return _.filter(this._data, iterator);
            };
            Collection.prototype.findFirst = function (iterator) {
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
            Collection.prototype.toArray = function () {
                return _.clone(this._data);
            };
            return Collection;
        })();
        Data.Collection = Collection;
        var Collection;
        (function (Collection) {
            var Events;
            (function (Events) {
                Events.ADD = "add";
                Events.CHANGE = "change";
                Events.REMOVE = "remove";
                Events.REPLACE = "replace";
                Events.CLEAR = "clear";
            })(Events = Collection.Events || (Collection.Events = {}));
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var List = (function () {
            function List(data) {
                this.events = new TSCore.Events.EventEmitter();
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
                this._data.push(item);
                this.events.trigger(TSCore.Data.List.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.addMany = function (items) {
                if (items === void 0) { items = []; }
                this._data = this._data.concat(items);
                this.events.trigger(TSCore.Data.List.Events.ADD, { items: items });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.prepend = function (item) {
                this.insert(item, 0);
            };
            List.prototype.prependMany = function (items) {
                this._data = items.concat(this._data);
                this.events.trigger(TSCore.Data.List.Events.ADD, { items: items });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.insert = function (item, index) {
                this._data.splice(index, 0, item);
                this.events.trigger(TSCore.Data.List.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.remove = function (item) {
                this._data = _.without(this._data, item);
                this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: [item] });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.removeMany = function (items) {
                this._data = _.difference(this._data, items);
                this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: items });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
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
                this.events.trigger(TSCore.Data.List.Events.REPLACE, { source: currentItem, replacement: replacement });
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
                return currentItem;
            };
            List.prototype.clear = function () {
                this._data = [];
                this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: this.toArray() });
                this.events.trigger(TSCore.Data.List.Events.CLEAR);
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
            };
            List.prototype.each = function (iterator) {
                _.each(this._data, iterator);
            };
            List.prototype.pluck = function (propertyName) {
                return _.pluck(this._data, propertyName);
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
                this.events.trigger(TSCore.Data.List.Events.CHANGE);
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
            return List;
        })();
        Data.List = List;
        var List;
        (function (List) {
            var Events;
            (function (Events) {
                Events.ADD = "add";
                Events.CHANGE = "change";
                Events.REMOVE = "remove";
                Events.REPLACE = "replace";
                Events.CLEAR = "clear";
            })(Events = List.Events || (List.Events = {}));
        })(List = Data.List || (Data.List = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Model = (function () {
            function Model(data) {
                this._defaults = this.defaults();
                this._whitelist = this.whitelist();
                _.defaults(this, this._defaults);
                if (data) {
                    this.assign(data);
                }
            }
            Model.prototype.whitelist = function () {
                return [];
            };
            Model.prototype.defaults = function () {
                return {};
            };
            Model.prototype.assign = function (data) {
                var _this = this;
                _.each(this._whitelist, function (attr) {
                    _this[attr] = !_.isUndefined(data[attr]) ? data[attr] : _this[attr] || null;
                });
                return this;
            };
            Model.prototype.toObject = function () {
                var _this = this;
                var result = {};
                _.each(_.keys(this), function (key) {
                    var value = _this[key];
                    if (key.slice(0, '_'.length) != '_') {
                        var parsedValue = value;
                        if (value instanceof Model) {
                            parsedValue = value.toObject();
                        }
                        result[key] = parsedValue;
                    }
                });
                return result;
            };
            return Model;
        })();
        Data.Model = Model;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Collection.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var ModelCollection = (function (_super) {
            __extends(ModelCollection, _super);
            function ModelCollection(modelClass, primaryKey, data) {
                this._modelClass = modelClass;
                this._primaryKey = primaryKey || 'id';
                _super.call(this, data);
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
                var predicate = {};
                predicate[this._primaryKey] = item[this._primaryKey];
                return this.whereFirst(predicate) != null;
            };
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
        })(Data.Collection);
        Data.ModelCollection = ModelCollection;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Collection.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var ModelDictionary = (function (_super) {
            __extends(ModelDictionary, _super);
            function ModelDictionary(modelClass, primaryKey, data) {
                this._modelClass = modelClass;
                this._primaryKey = primaryKey || 'id';
                _super.call(this, data);
            }
            ModelDictionary.prototype.addManyData = function (data) {
                var _this = this;
                var addedItems = [];
                _.each(data, function (item) {
                    var instance = _this._instantiateModel(item);
                    _this.set(item[_this._primaryKey], instance);
                    addedItems.push(instance);
                });
                return addedItems;
            };
            ModelDictionary.prototype.addData = function (data) {
                var instance = this._instantiateModel(data);
                this.set(data[this._primaryKey], instance);
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
        })(Data.Dictionary);
        Data.ModelDictionary = ModelDictionary;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var SortedList = (function () {
            function SortedList(data, sortPredicate) {
                this.events = new TSCore.Events.EventEmitter();
                this._data = data || [];
                this._sortPredicate = sortPredicate;
                this.sort();
            }
            Object.defineProperty(SortedList.prototype, "sortPredicate", {
                get: function () {
                    return this._sortPredicate;
                },
                set: function (predicate) {
                    this._sortPredicate = predicate;
                    this.sort();
                },
                enumerable: true,
                configurable: true
            });
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
                this._data.push(item);
                this.sort();
                this.events.trigger(TSCore.Data.SortedList.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
            };
            SortedList.prototype.addMany = function (items) {
                if (items === void 0) { items = []; }
                this._data = this._data.concat(items);
                this.sort();
                this.events.trigger(TSCore.Data.SortedList.Events.ADD, { items: items });
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
            };
            SortedList.prototype.remove = function (item) {
                this._data = _.without(this._data, item);
                this.sort();
                this.events.trigger(TSCore.Data.SortedList.Events.REMOVE, { items: [item] });
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
            };
            SortedList.prototype.removeMany = function (items) {
                this._data = _.difference(this._data, items);
                this.sort();
                this.events.trigger(TSCore.Data.SortedList.Events.REMOVE, { items: items });
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
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
                this.events.trigger(TSCore.Data.SortedList.Events.REPLACE, { source: source, replacement: replacement });
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
                return currentItem;
            };
            SortedList.prototype.clear = function () {
                this._data = [];
                this.events.trigger(TSCore.Data.SortedList.Events.REMOVE, { items: this.toArray() });
                this.events.trigger(TSCore.Data.SortedList.Events.CLEAR);
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
            };
            SortedList.prototype.each = function (iterator) {
                _.each(this._data, iterator);
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
            SortedList.prototype.sort = function () {
                if (this._sortPredicate === null || this._sortPredicate === undefined) {
                    return;
                }
                this._data = _.sortBy(this._data, this._sortPredicate);
                this.events.trigger(TSCore.Data.SortedList.Events.SORT);
                this.events.trigger(TSCore.Data.SortedList.Events.CHANGE);
            };
            return SortedList;
        })();
        Data.SortedList = SortedList;
        var SortedList;
        (function (SortedList) {
            var Events;
            (function (Events) {
                Events.ADD = "add";
                Events.CHANGE = "change";
                Events.REMOVE = "remove";
                Events.REPLACE = "replace";
                Events.CLEAR = "clear";
                Events.SORT = "sort";
            })(Events = SortedList.Events || (SortedList.Events = {}));
        })(SortedList = Data.SortedList || (Data.SortedList = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Dictionary.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Store = (function (_super) {
            __extends(Store, _super);
            function Store(_storage, data) {
                _super.call(this, data);
                this._storage = _storage;
                this.load();
            }
            Store.prototype.load = function () {
                for (var key in this._storage) {
                    this.set(key, this._storage[key]);
                }
            };
            Store.prototype.get = function (key) {
                _super.prototype.get.call(this, key);
            };
            Store.prototype.set = function (key, value) {
                _super.prototype.set.call(this, key, value);
                this._storage.setItem(key, value);
            };
            Store.prototype.remove = function (key) {
                _super.prototype.remove.call(this, key);
                this._storage.removeItem(key);
            };
            Store.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this._storage.clear();
            };
            return Store;
        })(TSCore.Data.Dictionary);
        Data.Store = Store;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var DateTime;
    (function (DateTime) {
        var DateFormatter = (function () {
            function DateFormatter() {
            }
            return DateFormatter;
        })();
        DateTime.DateFormatter = DateFormatter;
    })(DateTime = TSCore.DateTime || (TSCore.DateTime = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var DateTime;
    (function (DateTime_1) {
        var DateTime = (function () {
            function DateTime() {
            }
            return DateTime;
        })();
        DateTime_1.DateTime = DateTime;
    })(DateTime = TSCore.DateTime || (TSCore.DateTime = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var DateTime;
    (function (DateTime) {
        var Timer = (function () {
            function Timer(timeout, tickCallback, repeats) {
                if (tickCallback === void 0) { tickCallback = null; }
                if (repeats === void 0) { repeats = false; }
                this.events = new TSCore.Events.EventEmitter();
                this.timeout = timeout;
                this.tickCallback = tickCallback;
                this.repeats = repeats;
            }
            Object.defineProperty(Timer.prototype, "tickCount", {
                get: function () { return this._tickCount; },
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
                get: function () { return this._startDate; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Timer.prototype, "isStarted", {
                get: function () { return this._isStarted; },
                enumerable: true,
                configurable: true
            });
            Timer.prototype.start = function () {
                if (this._isStarted) {
                    return;
                }
                this._tickCount = 0;
                this._startDate = new Date();
                this.events.trigger(TSCore.DateTime.Timer.Events.START, {
                    startDate: this._startDate
                });
                this.resume();
            };
            Timer.prototype.resume = function () {
                if (this._isStarted) {
                    return;
                }
                this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
                this._internalTimerIsInterval = this.repeats;
                this._isStarted = true;
                this.events.trigger(TSCore.DateTime.Timer.Events.RESUME, {
                    startDate: this._startDate,
                    tickCount: this._tickCount,
                    elapsedTime: this.elapsedTime
                });
            };
            Timer.prototype.pause = function () {
                if (!this._isStarted) {
                    return;
                }
                (this._internalTimerIsInterval ? clearInterval : clearTimeout)(this._internalTimer);
                this._internalTimer = null;
                this._isStarted = false;
                this.events.trigger(TSCore.DateTime.Timer.Events.PAUSE, {
                    startDate: this._startDate,
                    tickCount: this._tickCount,
                    elapsedTime: this.elapsedTime
                });
            };
            Timer.prototype.restart = function () {
                this.stop();
                this.start();
            };
            Timer.prototype.stop = function () {
                var eventParams = {
                    startDate: this._startDate,
                    tickCount: this._tickCount,
                    elapsedTime: this.elapsedTime
                };
                this.reset();
                this.events.trigger(TSCore.DateTime.Timer.Events.STOP, eventParams);
            };
            Timer.prototype.reset = function () {
                if (this._isStarted) {
                    this.pause();
                }
                this._tickCount = 0;
                this._startDate = null;
            };
            Timer.start = function (timeout, tickCallback, repeats) {
                if (tickCallback === void 0) { tickCallback = null; }
                if (repeats === void 0) { repeats = false; }
                var timer = new Timer(timeout, tickCallback, repeats);
                timer.start();
                return timer;
            };
            Timer.prototype._timerTick = function () {
                this._tickCount++;
                if (this.tickCallback) {
                    this.tickCallback(this._tickCount, this.elapsedTime);
                }
                this.events.trigger(TSCore.DateTime.Timer.Events.TICK, {
                    startDate: this._startDate,
                    tickCount: this._tickCount,
                    elapsedTime: this.elapsedTime
                });
            };
            return Timer;
        })();
        DateTime.Timer = Timer;
        var Timer;
        (function (Timer) {
            var Events;
            (function (Events) {
                Events.START = "start";
                Events.PAUSE = "pause";
                Events.RESUME = "resume";
                Events.STOP = "stop";
                Events.TICK = "tick";
            })(Events = Timer.Events || (Timer.Events = {}));
        })(Timer = DateTime.Timer || (DateTime.Timer = {}));
    })(DateTime = TSCore.DateTime || (TSCore.DateTime = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Exception;
    (function (Exception) {
        var ArgumentException = (function () {
            function ArgumentException() {
            }
            return ArgumentException;
        })();
        Exception.ArgumentException = ArgumentException;
    })(Exception = TSCore.Exception || (TSCore.Exception = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Exception;
    (function (Exception_1) {
        var Exception = (function () {
            function Exception(message, code, data) {
                if (code === void 0) { code = 0; }
                if (data === void 0) { data = null; }
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
        })();
        Exception_1.Exception = Exception;
    })(Exception = TSCore.Exception || (TSCore.Exception = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Geometry;
    (function (Geometry) {
        var Point = (function () {
            function Point(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            Point.prototype.translate = function (x, y) {
                this.x += x;
                this.y += y;
            };
            return Point;
        })();
        Geometry.Point = Point;
    })(Geometry = TSCore.Geometry || (TSCore.Geometry = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Geometry;
    (function (Geometry) {
        var Rect = (function () {
            function Rect(x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.origin = new Geometry.Point(x, y);
                this.size = new Geometry.Size(width, height);
            }
            Object.defineProperty(Rect.prototype, "x", {
                get: function () {
                    return this.origin.x;
                },
                set: function (x) {
                    this.origin.x = x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rect.prototype, "y", {
                get: function () {
                    return this.origin.y;
                },
                set: function (y) {
                    this.origin.y = y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rect.prototype, "width", {
                get: function () {
                    return this.size.width;
                },
                set: function (width) {
                    this.size.width = width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rect.prototype, "height", {
                get: function () {
                    return this.size.height;
                },
                set: function (height) {
                    this.size.height = height;
                },
                enumerable: true,
                configurable: true
            });
            Rect.prototype.center = function () {
                return new Geometry.Point(this.origin.x + this.size.halfWidth(), this.origin.y + this.size.halfHeight());
            };
            Rect.prototype.topLeft = function () {
                return new Geometry.Point(this.origin.x, this.origin.y);
            };
            Rect.prototype.bottomLeft = function () {
                return new Geometry.Point(this.origin.x, this.origin.y + this.size.height);
            };
            Rect.prototype.topRight = function () {
                return new Geometry.Point(this.origin.x + this.size.width, this.origin.y);
            };
            Rect.prototype.bottomRight = function () {
                return new Geometry.Point(this.origin.x + this.size.width, this.origin.y + this.size.height);
            };
            Rect.prototype.halfWidth = function () {
                return this.size.halfWidth();
            };
            Rect.prototype.halfHeight = function () {
                return this.size.halfHeight();
            };
            Rect.prototype.containsPoint = function (point) {
                var topLeft = this.topLeft();
                var bottomRight = this.bottomRight();
                return point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y;
            };
            Rect.prototype.containsRect = function (rect) {
                return this.containsPoint(rect.topLeft()) && this.containsPoint(rect.bottomRight());
            };
            Rect.prototype.intersectsRect = function (rect) {
                return this.containsPoint(rect.topLeft()) || this.containsPoint(rect.bottomLeft()) || this.containsPoint(rect.topRight()) || this.containsPoint(rect.bottomRight());
            };
            Rect.prototype.inset = function (top, right, bottom, left) {
                this.origin.x += left;
                this.origin.y += top;
                this.size.width -= right;
                this.size.height -= bottom;
                return this;
            };
            Rect.prototype.insetCenter = function (horizontal, vertical) {
                this.inset(vertical / 2, horizontal / 2, vertical / 2, horizontal / 2);
                return this;
            };
            Rect.prototype.expand = function (horizontal, vertical) {
                this.insetCenter(-horizontal, -vertical);
                return this;
            };
            Rect.prototype.reduce = function (horizontal, vertical) {
                this.insetCenter(horizontal, vertical);
                return this;
            };
            return Rect;
        })();
        Geometry.Rect = Rect;
    })(Geometry = TSCore.Geometry || (TSCore.Geometry = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Geometry;
    (function (Geometry) {
        var Size = (function () {
            function Size(width, height) {
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.width = width;
                this.height = height;
            }
            Size.prototype.halfWidth = function () {
                return this.width / 2;
            };
            Size.prototype.halfHeight = function () {
                return this.height / 2;
            };
            return Size;
        })();
        Geometry.Size = Size;
    })(Geometry = TSCore.Geometry || (TSCore.Geometry = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Text;
    (function (Text) {
        var Language = (function () {
            function Language() {
            }
            return Language;
        })();
        Text.Language = Language;
    })(Text = TSCore.Text || (TSCore.Text = {}));
})(TSCore || (TSCore = {}));
/// <reference path="Stream/IStream.ts" />
var TSCore;
(function (TSCore) {
    var Logger;
    (function (Logger_1) {
        (function (LogLevel) {
            LogLevel[LogLevel["LOG"] = 0] = "LOG";
            LogLevel[LogLevel["INFO"] = 1] = "INFO";
            LogLevel[LogLevel["WARN"] = 2] = "WARN";
            LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
            LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
        })(Logger_1.LogLevel || (Logger_1.LogLevel = {}));
        var LogLevel = Logger_1.LogLevel;
        var Logger = (function () {
            function Logger(parent, tag) {
                this._parent = parent;
                this._tag = tag;
                this._streams = this._parent ? this._parent.getStreams() : new TSCore.Data.Dictionary();
            }
            Logger.prototype.child = function (tag) {
                return new Logger(this, tag);
            };
            Logger.prototype.addStream = function (key, stream, level) {
                if (level === void 0) { level = LogLevel.LOG; }
                this._streams.set(key, {
                    level: level,
                    stream: stream
                });
            };
            Logger.prototype.removeStream = function (key) {
                this._streams.remove(key);
            };
            Logger.prototype.getStreams = function () {
                return this._streams;
            };
            Logger.prototype.log = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec(LogLevel.LOG, args);
            };
            Logger.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec(LogLevel.INFO, args);
            };
            Logger.prototype.warn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec(LogLevel.WARN, args);
            };
            Logger.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec(LogLevel.ERROR, args);
            };
            Logger.prototype.fatal = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec(LogLevel.FATAL, args);
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
        })();
        Logger_1.Logger = Logger;
    })(Logger = TSCore.Logger || (TSCore.Logger = {}));
})(TSCore || (TSCore = {}));
/// <reference path="IStream.ts" />
var TSCore;
(function (TSCore) {
    var Logger;
    (function (Logger) {
        var Stream;
        (function (Stream) {
            var Console = (function () {
                function Console(_console, colorsEnabled) {
                    if (colorsEnabled === void 0) { colorsEnabled = true; }
                    this._console = _console;
                    this.colorsEnabled = colorsEnabled;
                }
                Console.prototype.exec = function (options) {
                    var method;
                    switch (options.level) {
                        case TSCore.Logger.LogLevel.LOG:
                            method = 'log';
                            break;
                        case TSCore.Logger.LogLevel.INFO:
                            method = 'info';
                            break;
                        case TSCore.Logger.LogLevel.WARN:
                            method = 'warn';
                            break;
                        case TSCore.Logger.LogLevel.ERROR:
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
                    for (var i = 0, hash = 0; i < input.length; hash = input.charCodeAt(i++) + ((hash << 5) - hash))
                        ;
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
            })();
            Stream.Console = Console;
        })(Stream = Logger.Stream || (Logger.Stream = {}));
    })(Logger = TSCore.Logger || (TSCore.Logger = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Utils;
    (function (Utils) {
        var Base64 = (function () {
            function Base64() {
            }
            Base64.prototype.encode = function (input) {
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
                var keyStr = Base64.keyStr;
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
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
        })();
        Utils.Base64 = Base64;
    })(Utils = TSCore.Utils || (TSCore.Utils = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Utils;
    (function (Utils) {
        var Random = (function () {
            function Random() {
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
        })();
        Utils.Random = Random;
    })(Utils = TSCore.Utils || (TSCore.Utils = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Utils;
    (function (Utils) {
        var Text = (function () {
            function Text() {
            }
            Text.escapeHtml = function (input) {
                var entityMap = Text.HtmlEntityMap;
                return input.replace(/[&<>"'\/]/g, function (s) {
                    return entityMap[s];
                });
            };
            Text.truncate = function (input, maxLength, suffix) {
                if (suffix === void 0) { suffix = '...'; }
                if (input.length <= length) {
                    return input;
                }
                return input.substring(0, length) + suffix;
            };
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
            Text.zeroPad = function (input, width, zero) {
                if (zero === void 0) { zero = '0'; }
                return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
            };
            Text.ucFirst = function (input) {
                if (input == '') {
                    return input;
                }
                return input.charAt(0).toUpperCase() + input.slice(1);
            };
            Text.startsWith = function (source, search) {
                return source.slice(0, search.length) == search;
            };
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
        })();
        Utils.Text = Text;
    })(Utils = TSCore.Utils || (TSCore.Utils = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Utils;
    (function (Utils) {
        var URL = (function () {
            function URL(path) {
                this._path = path;
            }
            Object.defineProperty(URL.prototype, "path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URL.prototype, "host", {
                get: function () {
                    return "www.example.com";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URL.prototype, "basePath", {
                get: function () {
                    return "http://www.example.com/";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URL.prototype, "relativePath", {
                get: function () {
                    return "home/index";
                },
                enumerable: true,
                configurable: true
            });
            return URL;
        })();
        Utils.URL = URL;
    })(Utils = TSCore.Utils || (TSCore.Utils = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSCore/Config.ts" />
/// <reference path="TSCore/DI.ts" />
/// <reference path="TSCore/Data/Collection.ts" />
/// <reference path="TSCore/Data/Dictionary.ts" />
/// <reference path="TSCore/Data/List.ts" />
/// <reference path="TSCore/Data/Model.ts" />
/// <reference path="TSCore/Data/ModelCollection.ts" />
/// <reference path="TSCore/Data/ModelDictionary.ts" />
/// <reference path="TSCore/Data/SortedList.ts" />
/// <reference path="TSCore/Data/Store.ts" />
/// <reference path="TSCore/DateTime/DateFormatter.ts" />
/// <reference path="TSCore/DateTime/DateTime.ts" />
/// <reference path="TSCore/DateTime/Timer.ts" />
/// <reference path="TSCore/Events/Event.ts" />
/// <reference path="TSCore/Events/EventEmitter.ts" />
/// <reference path="TSCore/Exception/ArgumentException.ts" />
/// <reference path="TSCore/Exception/Exception.ts" />
/// <reference path="TSCore/Geometry/Point.ts" />
/// <reference path="TSCore/Geometry/Rect.ts" />
/// <reference path="TSCore/Geometry/Size.ts" />
/// <reference path="TSCore/Language.ts" />
/// <reference path="TSCore/Logger/Logger.ts" />
/// <reference path="TSCore/Logger/Stream/Console.ts" />
/// <reference path="TSCore/Logger/Stream/IStream.ts" />
/// <reference path="TSCore/TSCore.ts" />
/// <reference path="TSCore/Utils/Base64.ts" />
/// <reference path="TSCore/Utils/Random.ts" />
/// <reference path="TSCore/Utils/Text.ts" />
/// <reference path="TSCore/Utils/URL.ts" />
//# sourceMappingURL=tscore.js.map