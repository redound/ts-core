"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collection_1 = require("./Collection");
var ModelCollection = (function (_super) {
    __extends(ModelCollection, _super);
    function ModelCollection(modelClass, data) {
        _super.call(this, data);
        this._modelClass = modelClass;
    }
    ModelCollection.prototype.addManyData = function (data) {
        var _this = this;
        var createdModels = [];
        _.each(data, function (item) {
            createdModels.push(_this._instantiateModel(item));
        });
        return this.addMany(createdModels);
    };
    ModelCollection.prototype.addData = function (data) {
        return this.add(this._instantiateModel(data));
    };
    ModelCollection.prototype.contains = function (item) {
        var primaryKey = this._modelClass.primaryKey();
        var predicate = {};
        predicate[primaryKey] = item[primaryKey];
        return this.whereFirst(predicate) != null;
    };
    ModelCollection.prototype.all = function () {
        return _.clone(this._data);
    };
    ModelCollection.prototype.toArray = function () {
        var result = [];
        this.each(function (item) {
            result.push(item.toObject());
        });
        return result;
    };
    ModelCollection.prototype._instantiateModel = function (data) {
        return new this._modelClass(data);
    };
    return ModelCollection;
}(Collection_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelCollection;
