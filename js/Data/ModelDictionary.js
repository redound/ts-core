"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dictionary_1 = require("./Dictionary");
var ModelDictionary = (function (_super) {
    __extends(ModelDictionary, _super);
    function ModelDictionary(modelClass, data) {
        _super.call(this, data);
        this._modelClass = modelClass;
    }
    ModelDictionary.prototype.addManyData = function (data) {
        var _this = this;
        var addedItems = [];
        _.each(data, function (item) {
            var instance = _this._instantiateModel(item);
            _this.set(item[_this._modelClass.primaryKey()], instance);
            addedItems.push(instance);
        });
        return addedItems;
    };
    ModelDictionary.prototype.addData = function (data) {
        var instance = this._instantiateModel(data);
        this.set(data[this._modelClass.primaryKey()], instance);
        return instance;
    };
    ModelDictionary.prototype.toArray = function () {
        return _.map(_super.prototype.toArray.call(this), function (item) {
            return item.toObject();
        });
    };
    ModelDictionary.prototype.toObject = function () {
        return _.mapObject(_super.prototype.toObject, function (item) {
            return item.toObject();
        });
    };
    ModelDictionary.prototype._instantiateModel = function (data) {
        return new this._modelClass(data);
    };
    return ModelDictionary;
}(Dictionary_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelDictionary;
