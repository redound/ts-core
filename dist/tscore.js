/// <reference path="../../tscore.d.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection = (function () {
            function Collection(data) {
                this._data = data || [];
            }
            Collection.prototype.add = function (item) {
                this._data.push(item);
            };
            Collection.prototype.addAll = function (items) {
                this._data = this._data.concat(items);
            };
            Collection.prototype.remove = function (item) {
                this._data = _.without(this._data, item);
            };
            Collection.prototype.removeAll = function (items) {
                this._data = _.difference(this._data, items);
            };
            Collection.prototype.first = function () {
                return _.first(this._data);
            };
            Collection.prototype.last = function () {
                return _.last(this._data);
            };
            Collection.prototype.reset = function () {
                this._data = [];
            };
            Collection.prototype.each = function (iterator) {
                _.each(this._data, iterator);
            };
            Collection.prototype.pluck = function (propertyName) {
                return _.pluck(this._data, propertyName);
            };
            Collection.prototype.count = function () {
                return this._data.length;
            };
            Object.defineProperty(Collection.prototype, "length", {
                get: function () {
                    return this.count();
                },
                enumerable: true,
                configurable: true
            });
            Collection.prototype.populate = function (items) {
                var _this = this;
                _.each(items, function (itemData) {
                    var model = _this.createItem(itemData);
                    if (model) {
                        return _this.add(model);
                    }
                });
            };
            Collection.prototype.find = function (iterator) {
                return _.find(this._data, iterator);
            };
            Collection.prototype.filter = function (iterator) {
                return _.filter(this._data, iterator);
            };
            Collection.prototype.where = function (properties) {
                return _.where(this._data, properties);
            };
            Collection.prototype.findWhere = function (properties) {
                return _.findWhere(this._data, properties);
            };
            Collection.prototype.toArray = function () {
                return _.clone(this._data);
            };
            Collection.prototype.createItem = function (itemData) {
                return itemData;
            };
            return Collection;
        })();
        Data.Collection = Collection;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../../tscore.d.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Model = (function () {
            function Model(attrs) {
                var _this = this;
                this.defaults = {};
                _.each(attrs, function (value, key) {
                    if (_this.defaults[key] != undefined) {
                        _this[key] = value;
                    }
                });
            }
            return Model;
        })();
        Data.Model = Model;
    })(Data = TSCore.Data || (TSCore.Data = {}));
})(TSCore || (TSCore = {}));
/// <reference path="../../tscore.d.ts" />
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
                this._internalTimerIsInterval ? clearInterval(this._internalTimer) : clearTimeout(this._internalTimer);
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
                    this.tickCallback(this._tickCount, new Date().getTime() - this._startDate.getTime());
                }
            };
            return Timer;
        })();
        DateTime.Timer = Timer;
    })(DateTime = TSCore.DateTime || (TSCore.DateTime = {}));
})(TSCore || (TSCore = {}));
/// <reference path="TSCore/Data/Collection.ts" />
/// <reference path="TSCore/Data/Model.ts" />
/// <reference path="TSCore/DateTime/Timer.ts" />
