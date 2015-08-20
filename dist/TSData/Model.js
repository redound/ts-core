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
//# sourceMappingURL=Model.js.map