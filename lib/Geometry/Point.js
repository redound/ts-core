"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    Point.prototype.translate = function (x, y) {
        this.x += x;
        this.y += y;
    };
    return Point;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Point;
