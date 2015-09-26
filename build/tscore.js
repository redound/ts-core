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
/// <reference path="../Events/EventEmitter.ts" />
var TSCore;
(function (TSCore) {
    var Auth;
    (function (Auth) {
        var Manager = (function () {
            function Manager() {
                this._authMethods = new TSCore.Data.Dictionary();
                this.sessions = new TSCore.Data.Dictionary();
                this.events = new TSCore.Events.EventEmitter();
            }
            Manager.prototype.login = function (method, credentials, done) {
                var _this = this;
                var authMethod = this._authMethods.get(method);
                if (!authMethod) {
                    done({ message: 'AuthMethod does not exist' }, null);
                }
                authMethod.login(credentials, function (error, identity) {
                    if (error) {
                        _this.events.trigger(TSCore.Auth.Manager.Events.LOGIN_ATTEMPT_FAIL, { credentials: credentials, method: method });
                        done(error, null);
                        return;
                    }
                    var session = _this._setSessionForMethod(method, identity);
                    _this.events.trigger(TSCore.Auth.Manager.Events.LOGIN_ATTEMPT_SUCCESS, {
                        credentials: credentials,
                        method: method,
                        session: session
                    });
                    _this.events.trigger(TSCore.Auth.Manager.Events.LOGIN, {
                        credentials: credentials,
                        method: method,
                        session: session
                    });
                    done(error, session);
                });
            };
            Manager.prototype._setSessionForMethod = function (method, identity) {
                var session = new Auth.Session();
                session.setIdentity(identity);
                this.sessions.set(method, session);
                return session;
            };
            Manager.prototype.logout = function (method, done) {
                var _this = this;
                var authMethod = this._authMethods.get(method);
                if (!authMethod) {
                    done({
                        message: 'AuthMethod does not exist'
                    });
                }
                var session = this.sessions.get(method);
                if (!session) {
                    done({
                        message: 'Session does not exist'
                    });
                }
                authMethod.logout(session, function (error) {
                    if (!error) {
                        _this.sessions.remove(method);
                    }
                    _this.events.trigger(TSCore.Auth.Manager.Events.LOGOUT, {
                        method: method
                    });
                    if (done) {
                        done(error);
                    }
                });
            };
            Manager.prototype.addMethod = function (method, authMethod) {
                this._authMethods.set(method, authMethod);
                return this;
            };
            Manager.prototype.removeMethod = function (method) {
                this._authMethods.remove(method);
                return this;
            };
            Manager.prototype.hasSessions = function () {
                return !this.sessions.isEmpty();
            };
            return Manager;
        })();
        Auth.Manager = Manager;
        var Manager;
        (function (Manager) {
            var Events;
            (function (Events) {
                Events.LOGIN_ATTEMPT_FAIL = "login-attempt-fail";
                Events.LOGIN_ATTEMPT_SUCCESS = "login-attempt-success";
                Events.LOGIN = "login";
                Events.LOGOUT = "logout";
            })(Events = Manager.Events || (Manager.Events = {}));
        })(Manager = Auth.Manager || (Auth.Manager = {}));
    })(Auth = TSCore.Auth || (TSCore.Auth = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Auth;
    (function (Auth) {
        var Method = (function () {
            function Method() {
            }
            Method.prototype.login = function (credentials, done) {
            };
            Method.prototype.logout = function (session, done) {
            };
            return Method;
        })();
        Auth.Method = Method;
    })(Auth = TSCore.Auth || (TSCore.Auth = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Auth;
    (function (Auth) {
        var Session = (function () {
            function Session(_method, _identity) {
                this._method = _method;
                this._identity = _identity;
            }
            Session.prototype.getIdentity = function () {
                return this._identity;
            };
            Session.prototype.setIdentity = function (identity) {
                this._identity = identity;
                return this;
            };
            Session.prototype.getMethod = function () {
                return this._method;
            };
            Session.prototype.setMethod = function (method) {
                this._method = method;
                return this;
            };
            return Session;
        })();
        Auth.Session = Session;
    })(Auth = TSCore.Auth || (TSCore.Auth = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Bootstrap = (function () {
        function Bootstrap() {
        }
        Bootstrap.prototype.init = function () {
            for (var method in this) {
                if (TSCore.Utils.Text.startsWith(method, "_init")) {
                    this[method]();
                }
            }
        };
        return Bootstrap;
    })();
    TSCore.Bootstrap = Bootstrap;
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
        var Set = (function () {
            function Set(data) {
                this.events = new TSCore.Events.EventEmitter();
                this._data = data || [];
            }
            Object.defineProperty(Set.prototype, "length", {
                get: function () {
                    return this.count();
                },
                enumerable: true,
                configurable: true
            });
            Set.prototype.count = function () {
                return this._data.length;
            };
            Set.prototype.add = function (item) {
                this._data.push(item);
                this.events.trigger(TSCore.Data.Set.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
            };
            Set.prototype.addMany = function (items) {
                if (items === void 0) { items = []; }
                this._data = this._data.concat(items);
                this.events.trigger(TSCore.Data.Set.Events.ADD, { items: items });
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
            };
            Set.prototype.remove = function (item) {
                this._data = _.without(this._data, item);
                this.events.trigger(TSCore.Data.Set.Events.REMOVE, { items: [item] });
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
            };
            Set.prototype.removeMany = function (items) {
                this._data = _.difference(this._data, items);
                this.events.trigger(TSCore.Data.Set.Events.REMOVE, { items: items });
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
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
                this.events.trigger(TSCore.Data.Set.Events.REPLACE, { source: source, replacement: replacement });
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
                return currentItem;
            };
            Set.prototype.clear = function () {
                this._data = [];
                this.events.trigger(TSCore.Data.Set.Events.REMOVE, { items: this.toArray() });
                this.events.trigger(TSCore.Data.Set.Events.CLEAR);
                this.events.trigger(TSCore.Data.Set.Events.CHANGE);
            };
            Set.prototype.each = function (iterator) {
                _.each(this._data, iterator);
            };
            Set.prototype.pluck = function (propertyName) {
                return _.pluck(this._data, propertyName);
            };
            Set.prototype.isEmpty = function () {
                return this.count() === 0;
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
            return Set;
        })();
        Data.Set = Set;
        var Set;
        (function (Set) {
            var Events;
            (function (Events) {
                Events.ADD = "add";
                Events.CHANGE = "change";
                Events.REMOVE = "remove";
                Events.REPLACE = "replace";
                Events.CLEAR = "clear";
            })(Events = Set.Events || (Set.Events = {}));
        })(Set = Data.Set || (Data.Set = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../Events/EventEmitter.ts" />
/// <reference path="Set.ts" />
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
/// <reference path="./Set.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
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
                this.events.trigger(TSCore.Data.Collection.Events.ADD, { items: items });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
            };
            Collection.prototype.insert = function (item, index) {
                this._data.splice(index, 0, item);
                this.events.trigger(TSCore.Data.Collection.Events.ADD, { items: [item] });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
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
                this.events.trigger(TSCore.Data.Collection.Events.REPLACE, { source: currentItem, replacement: replacement });
                this.events.trigger(TSCore.Data.Collection.Events.CHANGE);
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
        })(Data.Set);
        Data.Collection = Collection;
        var Collection;
        (function (Collection) {
            var Events;
            (function (Events) {
                Events.ADD = Data.Set.Events.ADD;
                Events.CHANGE = Data.Set.Events.CHANGE;
                Events.REMOVE = Data.Set.Events.REMOVE;
                Events.REPLACE = Data.Set.Events.REPLACE;
                Events.CLEAR = Data.Set.Events.CLEAR;
            })(Events = Collection.Events || (Collection.Events = {}));
        })(Collection = Data.Collection || (Data.Collection = {}));
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Grid = (function () {
            function Grid() {
            }
            return Grid;
        })();
        Data.Grid = Grid;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
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
            function ModelCollection() {
                _super.apply(this, arguments);
            }
            return ModelCollection;
        })(Data.Collection);
        Data.ModelCollection = ModelCollection;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Queue = (function () {
            function Queue() {
            }
            return Queue;
        })();
        Data.Queue = Queue;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./ModelCollection.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var RemoteModelCollection = (function (_super) {
            __extends(RemoteModelCollection, _super);
            function RemoteModelCollection() {
                _super.apply(this, arguments);
            }
            return RemoteModelCollection;
        })(Data.ModelCollection);
        Data.RemoteModelCollection = RemoteModelCollection;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="./Set.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
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
                this.events.trigger(TSCore.Data.SortedCollection.Events.SORT);
                this.events.trigger(TSCore.Data.SortedCollection.Events.CHANGE);
            };
            return SortedCollection;
        })(Data.Set);
        Data.SortedCollection = SortedCollection;
        var SortedCollection;
        (function (SortedCollection) {
            var Events;
            (function (Events) {
                Events.ADD = Data.Set.Events.ADD;
                Events.CHANGE = Data.Set.Events.CHANGE;
                Events.REMOVE = Data.Set.Events.REMOVE;
                Events.REPLACE = Data.Set.Events.REPLACE;
                Events.CLEAR = Data.Set.Events.CLEAR;
                Events.SORT = "sort";
            })(Events = SortedCollection.Events || (SortedCollection.Events = {}));
        })(SortedCollection = Data.SortedCollection || (Data.SortedCollection = {}));
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
            LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
            LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
            LogLevel[LogLevel["INFO"] = 2] = "INFO";
            LogLevel[LogLevel["WARN"] = 3] = "WARN";
            LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
            LogLevel[LogLevel["FATAL"] = 5] = "FATAL";
        })(Logger_1.LogLevel || (Logger_1.LogLevel = {}));
        var LogLevel = Logger_1.LogLevel;
        var Logger = (function () {
            function Logger() {
                this._streams = new TSCore.Data.Dictionary();
            }
            Logger.prototype.setStream = function (key, logger) {
                this._streams.set(key, logger);
            };
            Logger.prototype.unsetStream = function (key) {
                this._streams.remove(key);
            };
            Logger.prototype.trace = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.TRACE,
                    args: args
                });
            };
            Logger.prototype.debug = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.DEBUG,
                    args: args
                });
            };
            Logger.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.INFO,
                    args: args
                });
            };
            Logger.prototype.warn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.WARN,
                    args: args
                });
            };
            Logger.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.ERROR,
                    args: args
                });
            };
            Logger.prototype.fatal = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this._exec({
                    level: TSCore.Logger.LogLevel.FATAL,
                    args: args
                });
            };
            Logger.prototype._exec = function (options) {
                this._streams.each(function (key, stream) {
                    stream.exec({
                        level: options.level,
                        args: options.args,
                        time: new Date().getTime()
                    });
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
                function Console(_console) {
                    this._console = _console;
                    this.level = TSCore.Logger.LogLevel.DEBUG;
                }
                Console.prototype.exec = function (options) {
                    var method;
                    if (this.level > options.level) {
                        return;
                    }
                    switch (options.level) {
                        case TSCore.Logger.LogLevel.DEBUG:
                            method = 'debug';
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
                    this._console[method].apply(this._console, options.args || []);
                };
                return Console;
            })();
            Stream.Console = Console;
        })(Stream = Logger.Stream || (Logger.Stream = {}));
    })(Logger = TSCore.Logger || (TSCore.Logger = {}));
})(TSCore || (TSCore = {}));
/// <reference path="IStream.ts" />
var TSCore;
(function (TSCore) {
    var Logger;
    (function (Logger) {
        var Stream;
        (function (Stream) {
            var Toastr = (function () {
                function Toastr() {
                }
                Toastr.prototype.exec = function () {
                };
                return Toastr;
            })();
            Stream.Toastr = Toastr;
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
/// <reference path="TSCore/Auth/Manager.ts" />
/// <reference path="TSCore/Auth/Method.ts" />
/// <reference path="TSCore/Auth/Session.ts" />
/// <reference path="TSCore/Bootstrap.ts" />
/// <reference path="TSCore/Config.ts" />
/// <reference path="TSCore/DI.ts" />
/// <reference path="TSCore/Data/Collection.ts" />
/// <reference path="TSCore/Data/Dictionary.ts" />
/// <reference path="TSCore/Data/Grid.ts" />
/// <reference path="TSCore/Data/Model.ts" />
/// <reference path="TSCore/Data/ModelCollection.ts" />
/// <reference path="TSCore/Data/Queue.ts" />
/// <reference path="TSCore/Data/RemoteModelCollection.ts" />
/// <reference path="TSCore/Data/Set.ts" />
/// <reference path="TSCore/Data/SortedCollection.ts" />
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
/// <reference path="TSCore/Logger/Stream/Toastr.ts" />
/// <reference path="TSCore/TSCore.ts" />
/// <reference path="TSCore/Utils/Base64.ts" />
/// <reference path="TSCore/Utils/Random.ts" />
/// <reference path="TSCore/Utils/Text.ts" />
/// <reference path="TSCore/Utils/URL.ts" />
//# sourceMappingURL=tscore.js.map