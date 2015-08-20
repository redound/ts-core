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
//# sourceMappingURL=Collection.js.map