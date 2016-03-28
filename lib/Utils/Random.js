"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Random = (function (_super) {
    __extends(Random, _super);
    function Random() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Random, "uuidLut", {
        get: function () {
            if (!Random._uuidLut) {
                var lut = [];
                for (var i = 0; i < 256; i++) {
                    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
                }
                Random._uuidLut = lut;
            }
            return Random._uuidLut;
        },
        enumerable: true,
        configurable: true
    });
    Random.number = function (min, max) {
        return Math.floor((Math.random() * max) + min);
    };
    Random.uniqueNumber = function () {
        return parseInt(new Date().getTime() + '' + Random.number(0, 100));
    };
    Random.bool = function () {
        return Random.number(0, 1) == 1;
    };
    Random.string = function (length, characters) {
        if (length === void 0) { length = 10; }
        if (characters === void 0) { characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
        var result = '';
        for (var i = length; i > 0; --i)
            result += characters[Math.round(Math.random() * (characters.length - 1))];
        return result;
    };
    Random.uuid = function () {
        var lut = this.uuidLut;
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };
    return Random;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Random;
