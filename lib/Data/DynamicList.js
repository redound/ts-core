"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List_1 = require("./List");
var DynamicList = (function (_super) {
    __extends(DynamicList, _super);
    function DynamicList() {
        _super.apply(this, arguments);
    }
    DynamicList.prototype.setRange = function (start, items) {
        if (start < 0) {
            throw 'Start index less than 0 (zero) not allowed.';
        }
        var rangeStartIndex = start;
        var rangeEndIndex = start + items.length;
        var dataEndIndex = Math.max(this._data.length, 0);
        for (var dataIndex = Math.min(dataEndIndex, rangeStartIndex); dataIndex < rangeEndIndex; dataIndex++) {
            this._data[dataIndex] = items[dataIndex - rangeStartIndex];
            if (this._data[dataIndex] === undefined) {
                this._data[dataIndex] = null;
            }
        }
    };
    DynamicList.prototype.containsRange = function (start, length) {
        var rangeStartIndex = start;
        var rangeEndIndex = start + length;
        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {
            if (!this._data[dataIndex]) {
                return false;
            }
        }
        return true;
    };
    DynamicList.prototype.getRange = function (start, length) {
        var rangeStartIndex = start;
        var rangeEndIndex = start + length;
        var items = [];
        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {
            if (!this._data[dataIndex]) {
                return null;
            }
            items.push(this._data[dataIndex]);
        }
        return items;
    };
    return DynamicList;
}(List_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DynamicList;
