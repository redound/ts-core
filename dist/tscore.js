/// <reference path="../../tscore.d.ts" />
var TSCore;
(function (TSCore) {
    var Data;
    (function (Data) {
        var Collection = (function () {
            function Collection(data) {
                this.data = data || [];
            }
            Collection.prototype.add = function (item) {
                this.data.push(item);
            };
            Collection.prototype.addAll = function (items) {
                this.data = this.data.concat(items);
            };
            Collection.prototype.remove = function (item) {
                this.data = _.without(this.data, item);
            };
            Collection.prototype.removeAll = function (items) {
                this.data = _.difference(this.data, items);
            };
            Collection.prototype.first = function () {
                return _.first(this.data);
            };
            Collection.prototype.last = function () {
                return _.last(this.data);
            };
            Collection.prototype.reset = function () {
                this.data = [];
            };
            Collection.prototype.each = function (iterator) {
                _.each(this.data, iterator);
            };
            Collection.prototype.pluck = function (propertyName) {
                return _.pluck(this.data, propertyName);
            };
            Collection.prototype.count = function () {
                return this.data.length;
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
                return _.find(this.data, iterator);
            };
            Collection.prototype.filter = function (iterator) {
                return _.filter(this.data, iterator);
            };
            Collection.prototype.where = function (properties) {
                return _.where(this.data, properties);
            };
            Collection.prototype.findWhere = function (properties) {
                return _.findWhere(this.data, properties);
            };
            Collection.prototype.toArray = function () {
                return _.clone(this.data);
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
/// <reference path="TSCore/Data/Collection.ts" />
/// <reference path="TSCore/Data/Model.ts" />
