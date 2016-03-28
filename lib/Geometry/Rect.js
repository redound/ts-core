"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Point_1 = require("./Point");
var Size_1 = require("./Size");
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        _super.call(this);
        this.origin = new Point_1.default(x, y);
        this.size = new Size_1.default(width, height);
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
        return new Point_1.default(this.origin.x + this.size.halfWidth(), this.origin.y + this.size.halfHeight());
    };
    Rect.prototype.topLeft = function () {
        return new Point_1.default(this.origin.x, this.origin.y);
    };
    Rect.prototype.bottomLeft = function () {
        return new Point_1.default(this.origin.x, this.origin.y + this.size.height);
    };
    Rect.prototype.topRight = function () {
        return new Point_1.default(this.origin.x + this.size.width, this.origin.y);
    };
    Rect.prototype.bottomRight = function () {
        return new Point_1.default(this.origin.x + this.size.width, this.origin.y + this.size.height);
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
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rect;
