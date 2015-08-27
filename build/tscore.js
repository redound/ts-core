var TSCore;
(function (TSCore) {
    var Events;
    (function (Events) {
        var EventEmitter = (function () {
            function EventEmitter() {
                this._eventCallbacks = {};
            }
            EventEmitter.prototype.on = function (events, callback, context) {
                var _this = this;
                _.each(events.split(' '), function (event) {
                    var callbackArray = _this._eventCallbacks[event];
                    if (!callbackArray) {
                        callbackArray = [];
                        _this._eventCallbacks[event] = callbackArray;
                    }
                    callbackArray.push({
                        callback: callback,
                        context: context
                    });
                });
            };
            EventEmitter.prototype.off = function (events, callback, context) {
                var _this = this;
                _.each(events.split(' '), function (event) {
                    var callbackArray = _this._eventCallbacks[event];
                    if (!callbackArray) {
                        return;
                    }
                    if (!callback) {
                        delete _this._eventCallbacks[event];
                        return;
                    }
                    var callbacksToRemove = _.where(callbackArray, context ? { callback: callback, context: context } : { callback: callback });
                    callbackArray = _.difference(callbackArray, callbacksToRemove);
                    if (callbackArray.length == 0) {
                        delete _this._eventCallbacks[event];
                    }
                    else {
                        _this._eventCallbacks[event] = callbackArray;
                    }
                });
            };
            EventEmitter.prototype.trigger = function (event) {
                var _this = this;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var callbackArray = this._eventCallbacks[event];
                if (!callbackArray) {
                    return;
                }
                _.each(callbackArray, function (item) {
                    item.callback.apply(item.context || _this, args || []);
                });
            };
            EventEmitter.prototype.resetEvents = function () {
                this._eventCallbacks = {};
            };
            return EventEmitter;
        })();
        Events.EventEmitter = EventEmitter;
    })(Events = TSCore.Events || (TSCore.Events = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../../Event/EventEmitter.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection) {
            var Dictionary = (function (_super) {
                __extends(Dictionary, _super);
                function Dictionary(data) {
                    _super.call(this);
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
                    this.trigger(Dictionary.EVENTS.SET, key, value, this);
                    this.trigger(Dictionary.EVENTS.CHANGE, this);
                };
                Dictionary.prototype.remove = function (key) {
                    var removedItem = null;
                    var foundPair = this._getPair(key);
                    if (foundPair) {
                        delete this._data[foundPair.key];
                        removedItem = foundPair.value;
                        this._itemCount--;
                        this.trigger(Dictionary.EVENTS.REMOVE, key, this);
                        this.trigger(Dictionary.EVENTS.CHANGE, this);
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
                    this.trigger(Dictionary.EVENTS.CLEAR, this);
                    this.trigger(Dictionary.EVENTS.CHANGE, this);
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
                Dictionary.EVENTS = {
                    CHANGE: 'change',
                    SET: 'add',
                    REMOVE: 'remove',
                    CLEAR: 'clear'
                };
                Dictionary._OBJECT_UNIQUE_ID_KEY = '__TSCore_Object_Unique_ID';
                Dictionary._OBJECT_UNIQUE_ID_COUNTER = 1;
                return Dictionary;
            })(TSCore.Events.EventEmitter);
            Collection.Dictionary = Dictionary;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Data/Collection/Dictionary.ts" />
var TSCore;
(function (TSCore) {
    var Dictionary = TSCore.Data.Collection.Dictionary;
    var DI = (function () {
        function DI() {
            this._services = new Dictionary();
            this._cache = new Dictionary();
        }
        DI.prototype.get = function (key, shared) {
            if (shared === void 0) { shared = false; }
            var serviceItem = this._services.get(key);
            var instance = null;
            var instantiateShared = shared === true || serviceItem.shared === true;
            if (instantiateShared && this._cache.contains(key)) {
                instance = this._cache.get(key);
            }
            if (!instance) {
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
        };
        DI.prototype.reset = function () {
            this._services.clear();
        };
        DI.prototype._instantiate = function (service) {
            var instance = null;
            if (_.isFunction(service)) {
                instance = service(this);
            }
            else {
                instance = service;
            }
            if (instance.setDI) {
                instance.setDI(this);
            }
            return service;
        };
        return DI;
    })();
    TSCore.DI = DI;
})(TSCore || (TSCore = {}));
/// <reference path="../../Event/EventEmitter.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection) {
            var Set = (function (_super) {
                __extends(Set, _super);
                function Set(data) {
                    _super.call(this);
                    this._data = data || [];
                }
                Object.defineProperty(Set.prototype, "length", {
                    get: function () {
                        return this.count();
                    },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.add = function (item) {
                    this._data.push(item);
                    this.trigger(Set.EVENTS.ADD, [item], this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                };
                Set.prototype.addMany = function (items) {
                    this._data = this._data.concat(items);
                    this.trigger(Set.EVENTS.ADD, items, this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                };
                Set.prototype.remove = function (item) {
                    this._data = _.without(this._data, item);
                    this.trigger(Set.EVENTS.REMOVE, [item], this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                };
                Set.prototype.removeMany = function (items) {
                    this._data = _.difference(this._data, items);
                    this.trigger(Set.EVENTS.REMOVE, items, this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                };
                Set.prototype.removeWhere = function (properties) {
                    this.removeMany(this.where(properties));
                };
                Set.prototype.replaceItem = function (source, replacement) {
                    var index = _.indexOf(this._data, source);
                    if (index < 0 || index >= this.count()) {
                        return null;
                    }
                    var currentItem = this._data[index];
                    this._data[index] = replacement;
                    this.trigger(Set.EVENTS.REPLACE, source, replacement, this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                    return currentItem;
                };
                Set.prototype.clear = function () {
                    this._data = [];
                    this.trigger(Set.EVENTS.REMOVE, this.toArray(), this);
                    this.trigger(Set.EVENTS.CLEAR, this);
                    this.trigger(Set.EVENTS.CHANGE, this);
                };
                Set.prototype.each = function (iterator) {
                    _.each(this._data, iterator);
                };
                Set.prototype.pluck = function (propertyName) {
                    return _.pluck(this._data, propertyName);
                };
                Set.prototype.count = function () {
                    return this._data.length;
                };
                Set.prototype.isEmpty = function () {
                    return this.count() === 0;
                };
                Set.prototype.populate = function (items) {
                    var _this = this;
                    _.each(items, function (itemData) {
                        var model = _this._createItem(itemData);
                        if (model) {
                            return _this.add(model);
                        }
                    });
                };
                Set.prototype.find = function (iterator) {
                    return _.filter(this._data, iterator);
                };
                Set.prototype.findFirst = function (iterator) {
                    return _.find(this._data, iterator);
                };
                Set.prototype.where = function (properties) {
                    return _.where(this._data, properties);
                };
                Set.prototype.whereFirst = function (properties) {
                    return _.findWhere(this._data, properties);
                };
                Set.prototype.contains = function (item) {
                    return _.contains(this._data, item);
                };
                Set.prototype.toArray = function () {
                    return _.clone(this._data);
                };
                Set.prototype._createItem = function (itemData) {
                    return itemData;
                };
                Set.EVENTS = {
                    CHANGE: 'change',
                    ADD: 'add',
                    REMOVE: 'remove',
                    REPLACE: 'replace',
                    CLEAR: 'clear'
                };
                return Set;
            })(TSCore.Events.EventEmitter);
            Collection.Set = Set;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Set.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection_1) {
            var Collection = (function (_super) {
                __extends(Collection, _super);
                function Collection() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(Collection.prototype, "length", {
                    get: function () {
                        return this.count();
                    },
                    enumerable: true,
                    configurable: true
                });
                Collection.prototype.prepend = function (item) {
                    this.insert(item, 0);
                };
                Collection.prototype.prependMany = function (items) {
                    this._data = items.concat(this._data);
                    this.trigger(Collection.EVENTS.ADD, [items], this);
                    this.trigger(Collection.EVENTS.CHANGE, this);
                };
                Collection.prototype.insert = function (item, index) {
                    this._data.splice(index, 0, item);
                    this.trigger(Collection.EVENTS.ADD, [item], this);
                    this.trigger(Collection.EVENTS.CHANGE, this);
                };
                Collection.prototype.replaceItem = function (source, replacement) {
                    return this.replace(this.indexOf(source), replacement);
                };
                Collection.prototype.replace = function (index, replacement) {
                    if (index < 0 || index >= this.count()) {
                        return null;
                    }
                    var currentItem = this._data[index];
                    this._data[index] = replacement;
                    this.trigger(Collection_1.Set.EVENTS.REPLACE, currentItem, replacement, this);
                    this.trigger(Collection_1.Set.EVENTS.CHANGE, this);
                    return currentItem;
                };
                Collection.prototype.first = function () {
                    return _.first(this._data);
                };
                Collection.prototype.last = function () {
                    return _.last(this._data);
                };
                Collection.prototype.get = function (index) {
                    return this._data[index];
                };
                Collection.prototype.indexOf = function (item) {
                    return _.indexOf(this._data, item);
                };
                return Collection;
            })(Collection_1.Set);
            Collection_1.Collection = Collection;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection) {
            var Grid = (function () {
                function Grid() {
                }
                return Grid;
            })();
            Collection.Grid = Grid;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection) {
            var Queue = (function () {
                function Queue() {
                }
                return Queue;
            })();
            Collection.Queue = Queue;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Set.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection;
        (function (Collection) {
            var SortedCollection = (function (_super) {
                __extends(SortedCollection, _super);
                function SortedCollection(data, sortPredicate) {
                    _super.call(this, data);
                    this._sortPredicate = sortPredicate;
                    this.sort();
                }
                Object.defineProperty(SortedCollection.prototype, "sortPredicate", {
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
                SortedCollection.prototype.add = function (item) {
                    _super.prototype.add.call(this, item);
                    this.sort();
                };
                SortedCollection.prototype.addMany = function (items) {
                    _super.prototype.addMany.call(this, items);
                    this.sort();
                };
                SortedCollection.prototype.remove = function (item) {
                    _super.prototype.remove.call(this, item);
                    this.sort();
                };
                SortedCollection.prototype.removeMany = function (items) {
                    _super.prototype.removeMany.call(this, items);
                    this.sort();
                };
                SortedCollection.prototype.replaceItem = function (source, replacement) {
                    var currentItem = _super.prototype.replaceItem.call(this, source, replacement);
                    this.sort();
                    return currentItem;
                };
                SortedCollection.prototype.first = function () {
                    return _.first(this._data);
                };
                SortedCollection.prototype.last = function () {
                    return _.last(this._data);
                };
                SortedCollection.prototype.get = function (index) {
                    return this._data[index];
                };
                SortedCollection.prototype.indexOf = function (item) {
                    return _.indexOf(this._data, item);
                };
                SortedCollection.prototype.sort = function () {
                    if (this._sortPredicate === null || this._sortPredicate === undefined) {
                        return;
                    }
                    this._data = _.sortBy(this._data, this._sortPredicate);
                    this.trigger(SortedCollection.EVENTS.SORT, this);
                    this.trigger(SortedCollection.EVENTS.CHANGE, this);
                };
                SortedCollection.EVENTS = {
                    CHANGE: 'change',
                    ADD: 'add',
                    REMOVE: 'remove',
                    REPLACE: 'replace',
                    CLEAR: 'clear',
                    SORT: 'sort'
                };
                return SortedCollection;
            })(Collection.Set);
            Collection.SortedCollection = SortedCollection;
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Config = (function () {
            function Config() {
            }
            return Config;
        })();
        Data.Config = Config;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Model;
        (function (Model_1) {
            var Model = (function () {
                function Model(attrs) {
                    var _this = this;
                    this.defaults = {};
                    _.each(attrs, function (value, key) {
                        if (_this.defaults[key] !== undefined) {
                            _this[key] = value;
                        }
                    });
                }
                return Model;
            })();
            Model_1.Model = Model;
        })(Model = Data.Model || (Data.Model = {}));
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
                this.resume();
            };
            Timer.prototype.resume = function () {
                if (this._isStarted) {
                    return;
                }
                this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
                this._internalTimerIsInterval = this.repeats;
                this._isStarted = true;
            };
            Timer.prototype.pause = function () {
                if (!this._isStarted) {
                    return;
                }
                (this._internalTimerIsInterval ? clearInterval : clearTimeout)(this._internalTimer);
                this._internalTimer = null;
                this._isStarted = false;
            };
            Timer.prototype.restart = function () {
                this.stop();
                this.start();
            };
            Timer.prototype.stop = function () {
                this.reset();
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
            };
            return Timer;
        })();
        DateTime.Timer = Timer;
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
            };
            Rect.prototype.insetCenter = function (horizontal, vertical) {
                this.inset(vertical / 2, horizontal / 2, vertical / 2, horizontal / 2);
            };
            Rect.prototype.expand = function (horizontal, vertical) {
                this.insetCenter(-horizontal, -vertical);
            };
            Rect.prototype.reduce = function (horizontal, vertical) {
                this.insetCenter(horizontal, vertical);
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
        var Format = (function () {
            function Format() {
            }
            Format.escapeHtml = function (input) {
                var entityMap = Format.HtmlEntityMap;
                return String(input).replace(/[&<>"'\/]/g, function (s) {
                    return entityMap[s];
                });
            };
            Format.truncate = function (input, maxLength, suffix) {
                if (suffix === void 0) { suffix = '...'; }
                if (input.length <= length) {
                    return input;
                }
                return input.substring(0, length) + suffix;
            };
            Format.concatenate = function (parts, seperator, lastSeparator) {
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
            Format.zeroPad = function (input, width, zero) {
                if (zero === void 0) { zero = '0'; }
                return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
            };
            Format.ucFirst = function (input) {
                if (input == '') {
                    return input;
                }
                return input.charAt(0).toUpperCase() + input.slice(1);
            };
            Format.HtmlEntityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };
            return Format;
        })();
        Text.Format = Format;
    })(Text = TSCore.Text || (TSCore.Text = {}));
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
var TSCore;
(function (TSCore) {
    var Text;
    (function (Text) {
        var Random = (function () {
            function Random() {
            }
            return Random;
        })();
        Text.Random = Random;
    })(Text = TSCore.Text || (TSCore.Text = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Text;
    (function (Text) {
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
        Text.URL = URL;
    })(Text = TSCore.Text || (TSCore.Text = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="TSCore/DI.ts" />
/// <reference path="TSCore/Data/Collection/Collection.ts" />
/// <reference path="TSCore/Data/Collection/Dictionary.ts" />
/// <reference path="TSCore/Data/Collection/Grid.ts" />
/// <reference path="TSCore/Data/Collection/Queue.ts" />
/// <reference path="TSCore/Data/Collection/Set.ts" />
/// <reference path="TSCore/Data/Collection/SortedCollection.ts" />
/// <reference path="TSCore/Data/Config.ts" />
/// <reference path="TSCore/Data/Model/Model.ts" />
/// <reference path="TSCore/DateTime/DateFormatter.ts" />
/// <reference path="TSCore/DateTime/DateTime.ts" />
/// <reference path="TSCore/DateTime/Timer.ts" />
/// <reference path="TSCore/Event/EventEmitter.ts" />
/// <reference path="TSCore/Exception/ArgumentException.ts" />
/// <reference path="TSCore/Exception/Exception.ts" />
/// <reference path="TSCore/Geometry/Point.ts" />
/// <reference path="TSCore/Geometry/Rect.ts" />
/// <reference path="TSCore/Geometry/Size.ts" />
/// <reference path="TSCore/TSCore.ts" />
/// <reference path="TSCore/Text/Format.ts" />
/// <reference path="TSCore/Text/Language.ts" />
/// <reference path="TSCore/Text/Random.ts" />
/// <reference path="TSCore/Text/URL.ts" />
//# sourceMappingURL=tscore.js.map