"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Size = (function (_super) {
    __extends(Size, _super);
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        _super.call(this);
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
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Size;
