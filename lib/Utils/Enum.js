"use strict";
var Enum = (function () {
    function Enum() {
    }
    Enum.names = function (e) {
        return Object.keys(e).filter(function (v) { return isNaN(parseInt(v, 10)); });
    };
    Enum.values = function (e) {
        return Object.keys(e).map(function (v) { return parseInt(v, 10); }).filter(function (v) { return !isNaN(v); });
    };
    Enum.object = function (e) {
        return Enum.values(e).map(function (v) {
            return {
                name: e[v],
                value: v
            };
        });
    };
    return Enum;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Enum;
