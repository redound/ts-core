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
