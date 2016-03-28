"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseObject_1 = require("./BaseObject");
var Dictionary_1 = require("./Data/Dictionary");
var DI = (function (_super) {
    __extends(DI, _super);
    function DI() {
        _super.call(this);
        this._services = new Dictionary_1.default();
        this._cache = new Dictionary_1.default();
    }
    DI.prototype.get = function (key, shared) {
        if (shared === void 0) { shared = false; }
        var serviceItem = this._services.get(key);
        var instance = null;
        var instantiateShared = shared === true || serviceItem && serviceItem.shared === true;
        if (instantiateShared && this._cache.contains(key)) {
            instance = this._cache.get(key);
        }
        if (serviceItem && !instance) {
            instance = this._instantiate(serviceItem.service);
        }
        if (instantiateShared) {
            this._cache.set(key, instance);
        }
        return instance;
    };
    DI.prototype.getShared = function (key) {
        return this.get(key, true);
    };
    DI.prototype.set = function (key, service, shared) {
        if (shared === void 0) { shared = false; }
        this._services.set(key, {
            service: service,
            shared: shared
        });
    };
    DI.prototype.setShared = function (key, service) {
        this.set(key, service, true);
        return this;
    };
    DI.prototype.reset = function () {
        this._services.clear();
        return this;
    };
    DI.prototype._instantiate = function (service) {
        var instance = null;
        if (_.isFunction(service)) {
            instance = service(this);
        }
        else {
            instance = service;
        }
        if (instance && instance.setDI) {
            instance.setDI(this);
        }
        return instance;
    };
    return DI;
}(BaseObject_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DI;
