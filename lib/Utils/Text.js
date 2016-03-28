"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("../BaseObject");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        _super.apply(this, arguments);
    }
    Text.escapeHtml = function (input) {
        var entityMap = Text.HtmlEntityMap;
        return input.replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };
    Text.truncate = function (input, maxLength, suffix) {
        if (suffix === void 0) { suffix = '...'; }
        if (input.length <= length) {
            return input;
        }
        return input.substring(0, length) + suffix;
    };
    Text.concatenate = function (parts, seperator, lastSeparator) {
        if (seperator === void 0) { seperator = ', '; }
        if (lastSeparator === void 0) { lastSeparator = seperator; }
        var result = '';
        _.each(parts, function (part, index) {
            if (index > 0) {
                if (index == parts.length - 1) {
                    result += lastSeparator;
                }
                else {
                    result += seperator;
                }
            }
            result += part;
        });
        return result;
    };
    Text.zeroPad = function (input, width, zero) {
        if (zero === void 0) { zero = '0'; }
        return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
    };
    Text.ucFirst = function (input) {
        if (input == '') {
            return input;
        }
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
    Text.startsWith = function (source, search) {
        return source.slice(0, search.length) == search;
    };
    Text.endsWith = function (source, search) {
        return source.slice(-search.length) == search;
    };
    Text.HtmlEntityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return Text;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Text;
