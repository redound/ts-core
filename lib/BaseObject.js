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
