/// <reference path="../tsdata.d.ts" />
var TSData;
(function (TSData) {
    var Collection = (function () {
        function Collection() {
        }
        Collection.prototype.add = function (item) {
            this.data.push(item);
        };
        Collection.prototype.buildModel = function (attrs) {
            return null;
        };
        Collection.prototype.populate = function (items) {
            var _this = this;
            _.each(items, function (item) {
                var model = _this.buildModel(item);
                if (model) {
                    return _this.add(model);
                }
            });
        };
        Collection.prototype.find = function () {
            return this.data;
        };
        Collection.prototype.findFirst = function () {
            return this.data[0];
        };
        return Collection;
    })();
    TSData.Collection = Collection;
})(TSData || (TSData = {}));
/// <reference path="../tsdata.d.ts" />
/// <reference path="Collection.ts" />
var TSData;
(function (TSData) {
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
    TSData.Model = Model;
})(TSData || (TSData = {}));
/// <reference path="TSData/Collection.ts" />
/// <reference path="TSData/Model.ts" />
