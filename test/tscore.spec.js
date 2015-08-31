/// <reference path="../../build/tscore.d.ts" /> 
/// <reference path="../TSCore.spec.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Mocks;
(function (Mocks) {
    var Bootstrap = (function (_super) {
        __extends(Bootstrap, _super);
        function Bootstrap() {
            _super.call(this);
            this.configSpy = jasmine.createSpy();
            this.loggerSpy = jasmine.createSpy();
            this.authManagerSpy = jasmine.createSpy();
        }
        Bootstrap.prototype._initConfig = function () {
            this.configSpy();
        };
        Bootstrap.prototype._initLogger = function () {
            this.loggerSpy();
        };
        Bootstrap.prototype._initAuthManager = function () {
            this.authManagerSpy();
        };
        return Bootstrap;
    })(TSCore.Bootstrap);
    Mocks.Bootstrap = Bootstrap;
})(Mocks || (Mocks = {}));
/// <reference path="TSCore.spec.ts" />
/// <reference path="./Mocks/Bootstrap.ts" />
describe("TSCore.Config", function () {
    it("should call each method starting with '_init'", function () {
        var bootstrap = new Mocks.Bootstrap();
        expect(bootstrap.configSpy).not.toHaveBeenCalled();
        expect(bootstrap.loggerSpy).not.toHaveBeenCalled();
        expect(bootstrap.authManagerSpy).not.toHaveBeenCalled();
        bootstrap.init();
        expect(bootstrap.configSpy).toHaveBeenCalled();
        expect(bootstrap.loggerSpy).toHaveBeenCalled();
        expect(bootstrap.authManagerSpy).toHaveBeenCalled();
    });
});
/// <reference path="TSCore.spec.ts" />
describe("TSCore.Config", function () {
    var config = new TSCore.Config();
    beforeEach(function () {
        config.clear();
    });
    describe("constructor()", function () {
        it("should load data when given", function () {
            var config = new TSCore.Config({
                value1: true,
                value2: true
            });
            expect(config.has('value1')).toBe(true);
            expect(config.has('value2')).toBe(true);
            expect(config.has('value3')).toBe(false);
        });
    });
    describe("clear()", function () {
        it("when given a key it should remove it", function () {
            config.load({
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                }
            });
            expect(config.get('value1')).toBe('Door');
            expect(config.get('value2')).toBe('Window');
            config.clear('value2');
            expect(config.get('value1')).toBe('Door');
            expect(config.get('value2')).toBe(null);
            expect(config.get('settings')).toEqual({
                open: true,
                locked: false
            });
            expect(config.get('settings.open')).toBe(true);
            expect(config.get('settings.locked')).toBe(false);
            config.clear('settings.open');
            expect(config.get('settings')).toEqual({
                locked: false
            });
            expect(config.get('settings.open')).toBe(null);
            expect(config.get('settings.locked')).toBe(false);
        });
        it("should clear all loaded properties", function () {
            config.load({
                value1: 'Door',
                value2: 'Window'
            });
            expect(config.get('value1')).toBe('Door');
            expect(config.get('value2')).toBe('Window');
            config.clear();
            expect(config.get('value1')).toBe(null);
            expect(config.get('value2')).toBe(null);
        });
    });
    describe("set()", function () {
        it("given value should be available through the given key using get()", function () {
            config.set('level1.level2.level3', 'value');
            expect(config.get('level1')).not.toBe(null);
            expect(config.get('level1.level2')).not.toBe(null);
            expect(config.get('level1.level2.level3')).not.toBe(null);
            expect(config.get('level1.level2.level3')).toBe('value');
        });
    });
    describe("get()", function () {
        it("depending whether there's a value set for the given key it should return the value or null", function () {
            var data = {
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                },
                level1: {
                    level2: {
                        level3: {}
                    }
                }
            };
            config.load(data);
            expect(config.get('settings')).toEqual({
                open: true,
                locked: false
            });
            expect(config.get('unavailable')).toBe(null);
            expect(config.get()).toEqual(data);
        });
    });
    describe("has()", function () {
        it("should return true or false depending on whether the (nested) property exists or not", function () {
            config.load({
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                },
                level1: {
                    level2: {
                        level3: {}
                    }
                }
            });
            expect(config.has('level1.level2.level3')).toBe(true);
            expect(config.has('level1.level2.level3.level4')).toBe(false);
        });
    });
});
/// <reference path="TSCore.spec.ts" />
describe("TSCore.DI", function () {
    var di = new TSCore.DI();
    beforeEach(function () {
        di.reset();
    });
    describe("set()", function () {
        it("should be able to resolve a function", function () {
            di.set('logger', function () {
                return 'resolvedValue';
            });
            expect(di.get('logger')).toEqual('resolvedValue');
        });
        it("should be able to return the value if it's not a function", function () {
            di.set('logger', 'value');
            expect(di.get('logger')).toEqual('value');
        });
    });
    describe("setShared()", function () {
        it("should cause get() to always resolve the same value", function () {
            var listener = jasmine.createSpy();
            di.setShared('logger', function () {
                listener();
                return 'value';
            });
            di.get('logger');
            di.get('logger');
            expect(listener).toHaveBeenCalled();
            expect(listener.calls.count()).toBe(1);
        });
    });
    describe("get()", function () {
        it("should always return a new instance", function () {
            var listener = jasmine.createSpy();
            di.set('bike', function () {
                listener();
                return;
            });
            expect(listener).not.toHaveBeenCalled();
            di.get('bike');
            expect(listener).toHaveBeenCalled();
            di.get('bike');
            expect(listener.calls.count()).toBe(2);
            di.get('car');
            expect(listener.calls.count()).toBe(2);
        });
    });
    describe("getShared()", function () {
        it("should always return the same instance", function () {
            function Car() {
                this.hasDriver = false;
            }
            var listener = jasmine.createSpy();
            di.set('car', function () {
                listener();
                return new Car();
            });
            var car = di.getShared('car');
            car.hasDriver = true;
            expect(di.getShared('car').hasDriver).toBe(true);
            expect(listener).toHaveBeenCalled();
            expect(listener.calls.count()).toBe(1);
            expect(di.get('car').hasDriver).toBe(false);
            expect(di.getShared('car').hasDriver).toBe(true);
        });
    });
    describe("reset()", function () {
        it("after being called services should be cleared", function () {
            di.set('a', 'A');
            di.set('b', 'B');
            expect(di.get('a')).toBe('A');
            expect(di.get('b')).toBe('B');
            di.reset();
            expect(di.get('a')).toBe(null);
            expect(di.get('b')).toBe(null);
        });
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Collection", function () {
    var animal1 = {
        id: 1,
        name: 'Cat'
    };
    var animal2 = {
        id: 2,
        name: 'Dog'
    };
    var animal3 = {
        id: 3,
        name: 'Horse'
    };
    var animal4 = {
        id: 4,
        name: 'Hippo'
    };
    var collection = new TSCore.Data.Collection();
    var addListener = jasmine.createSpy("CollectionEvents.ADD listener");
    collection.on(TSCore.Data.CollectionEvents.ADD, addListener);
    var changeListener = jasmine.createSpy("CollectionEvents.CHANGE listener");
    collection.on(TSCore.Data.CollectionEvents.CHANGE, changeListener);
    var removeListener = jasmine.createSpy("CollectionEvents.REMOVE listener");
    collection.on(TSCore.Data.CollectionEvents.REMOVE, removeListener);
    var replaceListener = jasmine.createSpy("CollectionEvents.REPLACE listener");
    collection.on(TSCore.Data.CollectionEvents.REPLACE, replaceListener);
    var clearListener = jasmine.createSpy("CollectionEvents.CLEAR listener");
    collection.on(TSCore.Data.CollectionEvents.CLEAR, clearListener);
    beforeEach(function () {
        collection.clear();
        addListener.calls.reset();
        changeListener.calls.reset();
        removeListener.calls.reset();
        replaceListener.calls.reset();
        clearListener.calls.reset();
    });
    describe("prepend()", function () {
        it("should prepend the collection with given item", function () {
            collection.addMany([animal2, animal3, animal4]);
            collection.prepend(animal1);
            expect(collection.first()).toEqual(animal1);
            collection.prepend(animal3);
            expect(collection.first()).toEqual(animal3);
        });
        it("should fire CollectionEvents.ADD containing the prepended item", function () {
            collection.prepend(animal1);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items[0]).toEqual(animal1);
            collection.prepend(animal2);
            expect(addListener.calls.count()).toBe(2);
        });
        it("should fire CollectionEvents.CHANGE", function () {
            collection.prepend(animal1);
            expect(changeListener).toHaveBeenCalled();
            collection.prepend(animal2);
            expect(changeListener.calls.count()).toBe(2);
        });
    });
    describe("prependMany()", function () {
        it("should prepend the collection with given items", function () {
            collection.addMany([animal4]);
            collection.prependMany([animal3, animal2, animal1]);
            expect(collection.get(0)).toEqual(animal3);
            expect(collection.get(1)).toEqual(animal2);
            expect(collection.get(2)).toEqual(animal1);
        });
        it("should fire CollectionEvents.ADD containing the prepended item", function () {
            var animals = [animal1, animal2, animal3];
            collection.prepend(animal4);
            collection.prependMany(animals);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items).toEqual(animals);
        });
        it("should fire CollectionEvents.CHANGE exactly once", function () {
            var animals = [animal1, animal2, animal3];
            collection.prependMany(animals);
            expect(changeListener).toHaveBeenCalled();
            collection.prepend(animal2);
            expect(changeListener.calls.count()).toBe(2);
        });
    });
    describe("insert()", function () {
        it("should insert given item at given index", function () {
            collection.addMany([animal1, animal2, animal3]);
            collection.insert(animal4, 2);
            expect(collection.get(2)).toEqual(animal4);
        });
        it("should fire CollectionEvents.ADD containing the inserted item", function () {
            collection.addMany([animal2, animal3, animal4]);
            collection.insert(animal1, 2);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items[0]).toEqual(animal1);
        });
        it("should fire CollectionEvents.CHANGE", function () {
            var animals = [animal1, animal2, animal3];
            collection.prependMany(animals);
            expect(changeListener).toHaveBeenCalled();
            collection.insert(animal2, 2);
            expect(changeListener.calls.count()).toBe(2);
        });
    });
    describe("replaceItem()", function () {
        it("should replace a given item for another given item", function () {
            collection.addMany([animal1, animal4, animal3]);
            collection.replaceItem(animal4, animal2);
            expect(collection.contains(animal2)).toBe(true);
            expect(collection.get(1)).toEqual(animal2);
        });
        it("should fire CollectionEvents.REPLACE containing the source and the replacement", function () {
            collection.addMany([animal1, animal3]);
            expect(replaceListener).not.toHaveBeenCalled();
            collection.replaceItem(animal3, animal2);
            expect(replaceListener).toHaveBeenCalled();
            expect(replaceListener.calls.mostRecent().args[0].params.source).toEqual(animal3);
            expect(replaceListener.calls.mostRecent().args[0].params.replacement).toEqual(animal2);
        });
        it("should fire CollectionEvents.CHANGE", function () {
            collection.addMany([animal1, animal3]);
            changeListener.calls.reset();
            expect(changeListener).not.toHaveBeenCalled();
            collection.replaceItem(animal3, animal2);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("replace()", function () {
        it("should replace given item at given index in the collection", function () {
            collection.addMany([animal1, animal2]);
            collection.replace(1, animal3);
            expect(collection.get(1)).toEqual(animal3);
        });
        it("should not allow replacing an empty index", function () {
            collection.addMany([animal1, animal2]);
            collection.replace(20, animal4);
            expect(collection.get(20)).not.toEqual(animal4);
        });
        it("should fire CollectionEvents.REPLACE containing the source and the replacement", function () {
            collection.addMany([animal1, animal2]);
            collection.replace(0, animal3);
            expect(replaceListener).toHaveBeenCalled();
            expect(replaceListener.calls.mostRecent().args[0].params.source).toEqual(animal1);
            expect(replaceListener.calls.mostRecent().args[0].params.replacement).toEqual(animal3);
        });
        it("should fire CollectionEvents.CHANGE", function () {
            collection.addMany([animal1, animal2]);
            changeListener.calls.reset();
            expect(changeListener).not.toHaveBeenCalled();
            collection.replace(0, animal3);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("first()", function () {
        it("should return the first item out of the collection", function () {
            collection.addMany([animal1, animal2, animal3]);
            expect(collection.first()).toEqual(animal1);
        });
    });
    describe("last()", function () {
        it("should return the last item out of the collection", function () {
            collection.addMany([animal1, animal2, animal3]);
            expect(collection.last()).toEqual(animal3);
        });
    });
    describe("get()", function () {
        it("should return the item in collection at the given index", function () {
            collection.addMany([animal1, animal2, animal3]);
            expect(collection.get(1)).toEqual(animal2);
        });
    });
    describe("indexOf()", function () {
        it("should return the index of given item in collection", function () {
            collection.addMany([animal1, animal2, animal3]);
            expect(collection.indexOf(animal3)).toBe(2);
        });
    });
    describe("clear()", function () {
        it("should fire CollectionEvents.CLEAR", function () {
            collection.addMany([animal1, animal2, animal3]);
            expect(clearListener).not.toHaveBeenCalled();
            collection.clear();
            expect(clearListener).toHaveBeenCalled();
        });
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Dictionary", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Grid", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.ModelCollection", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Queue", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.RemoteModelCollection", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Set", function () {
    var animal1 = {
        id: 1,
        name: 'Cat'
    };
    var animal2 = {
        id: 2,
        name: 'Dog'
    };
    var animal3 = {
        id: 3,
        name: 'Horse'
    };
    var animal4 = {
        id: 4,
        name: 'Hippo'
    };
    var basicSet = new TSCore.Data.Set();
    var eventSet = new TSCore.Data.Set();
    var addListener = jasmine.createSpy("SetEvents.ADD listener");
    eventSet.on(TSCore.Data.SetEvents.ADD, addListener);
    var changeListener = jasmine.createSpy("SetEvents.CHANGE listener");
    eventSet.on(TSCore.Data.SetEvents.CHANGE, changeListener);
    var removeListener = jasmine.createSpy("SetEvents.REMOVE listener");
    eventSet.on(TSCore.Data.SetEvents.REMOVE, removeListener);
    var replaceListener = jasmine.createSpy("SetEvents.REPLACE listener");
    eventSet.on(TSCore.Data.SetEvents.REPLACE, replaceListener);
    var clearListener = jasmine.createSpy("SetEvents.CLEAR listener");
    eventSet.on(TSCore.Data.SetEvents.CLEAR, clearListener);
    describe("General", function () {
        it("can contain same objects (allows duplicates)", function () {
            basicSet.clear();
            expect(basicSet.length).toBe(0);
            basicSet.addMany([animal1, animal2, animal3]);
            expect(basicSet.length).toBe(3);
        });
    });
    describe("add()", function () {
        it("should add an item to set", function () {
            basicSet.clear();
            expect(basicSet.length).toBe(0);
            basicSet.add(animal1);
            expect(basicSet.length).toBe(1);
        });
        it("should increase the size of the instance", function () {
            var animals = [animal1, animal2, animal3, animal4];
            basicSet.clear();
            for (var i = 0; i < animals.length; i++) {
                var animal = animals[i];
                basicSet.add(animal);
                expect(basicSet.length).toBe(i + 1);
            }
        });
        it("should fire SetEvents.ADD", function () {
            eventSet.clear();
            addListener.calls.reset();
            eventSet.add(animal1);
            expect(addListener).toHaveBeenCalled();
        });
        it("should fire SetEvents.CHANGE", function () {
            eventSet.clear();
            changeListener.calls.reset();
            eventSet.add(animal1);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("addMany()", function () {
        it("should add multiple items", function () {
            basicSet.clear();
            expect(basicSet.length).toBe(0);
            basicSet.addMany([animal1, animal2]);
            expect(basicSet.length).toBe(2);
        });
        it("should fire SetEvents.ADD", function () {
            eventSet.clear();
            addListener.calls.reset();
            eventSet.addMany([animal1, animal2]);
            expect(addListener).toHaveBeenCalled();
        });
        it("should fire SetEvents.CHANGE", function () {
            eventSet.clear();
            changeListener.calls.reset();
            eventSet.addMany([animal1, animal2]);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("remove()", function () {
        it("should remove remove all instances of object (also when it has duplicates)", function () {
            basicSet.clear();
            basicSet.addMany([animal1, animal1, animal2]);
            expect(basicSet.length).toBe(3);
            basicSet.remove(animal1);
            expect(basicSet.length).toBe(1);
        });
        it("should decrease the size of the instance", function () {
            var animals = [animal1, animal2, animal3, animal4];
            var dataSet = new TSCore.Data.Set(animals);
            for (var i = 0; i < animals.length; i++) {
                var animal = animals[i];
                dataSet.remove(animal);
                expect(dataSet.length).toBe(animals.length - (i + 1));
            }
        });
        it("should fire SetEvents.REMOVE", function () {
            eventSet.clear();
            eventSet.add(animal1);
            removeListener.calls.reset();
            eventSet.remove(animal1);
            expect(removeListener).toHaveBeenCalled();
        });
        it("should fire SetEvents.CHANGE", function () {
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            changeListener.calls.reset();
            eventSet.remove(animal1);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("removeMany()", function () {
        it("should remove multiple items including duplicates", function () {
            basicSet.clear();
            basicSet.addMany([animal1, animal1, animal2, animal3]);
            expect(basicSet.length).toBe(4);
            basicSet.removeMany([animal1, animal2]);
            expect(basicSet.length).toBe(1);
            basicSet.removeMany([animal3]);
            expect(basicSet.length).toBe(0);
        });
        it("should fire SetEvents.REMOVE", function () {
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            removeListener.calls.reset();
            eventSet.removeMany([animal1, animal2]);
            expect(removeListener).toHaveBeenCalled();
        });
        it("should fire SetEvents.CHANGE", function () {
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            changeListener.calls.reset();
            eventSet.removeMany([animal1, animal2]);
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("removeWhere()", function () {
        it("should remove single or multiple items from set based on properties", function () {
            basicSet.clear();
            basicSet.addMany([animal1, animal2, animal3, {
                    id: 15,
                    name: 'Sheep'
                }]);
            expect(basicSet.length).toBe(4);
            basicSet.removeWhere({ name: 'Sheep' });
            expect(basicSet.length).toBe(3);
            basicSet.addMany([{
                    id: 16,
                    name: 'Fish'
                }, {
                    id: 18,
                    name: 'Fish'
                }]);
            expect(basicSet.length).toBe(5);
            basicSet.removeWhere({ name: 'Fish' });
            expect(basicSet.length).toBe(3);
        });
        it("should fire SetEvents.REMOVE", function () {
            eventSet.clear();
            eventSet.addMany([{
                    id: 1,
                    name: 'Fish'
                }, {
                    id: 2,
                    name: 'Fish'
                }]);
            removeListener.calls.reset();
            eventSet.removeWhere({ name: 'Fish' });
            expect(removeListener).toHaveBeenCalled();
        });
        it("should fire SetEvents.CHANGE", function () {
            eventSet.clear();
            eventSet.addMany([{
                    id: 1,
                    name: 'Fish'
                }, {
                    id: 2,
                    name: 'Fish'
                }]);
            changeListener.calls.reset();
            eventSet.removeWhere({ name: 'Fish' });
            expect(changeListener).toHaveBeenCalled();
        });
    });
    describe("replaceItem()", function () {
        it("should replace one item for another", function () {
            basicSet.clear();
            basicSet.add(animal1);
            var replacedItem = basicSet.replaceItem(animal1, animal2);
            expect(replacedItem).toBe(animal1);
        });
        it("should only return the item when it gets replaced", function () {
            basicSet.clear();
            var replacedItem = basicSet.replaceItem(animal1, animal2);
            expect(replacedItem).toBe(null);
        });
    });
    describe("count()", function () {
        it("should alias magic getter for this._data.length", function () {
            var dataSet = new TSCore.Data.Set();
            dataSet.add(animal1);
            expect(dataSet.length).toBe(1);
            expect(dataSet.count()).toBe(1);
            dataSet.add(animal2);
            expect(dataSet.length).toBe(2);
            expect(dataSet.length).toBe(2);
        });
    });
    describe("each()", function () {
        it("should iterate over each item", function () {
            var animals = [animal1, animal2, animal3, animal4];
            basicSet.clear();
            basicSet.addMany(animals);
            basicSet.each(function (item) {
                var index = animals.indexOf(item);
                expect((index > -1)).toBe(true);
                animals.splice(0, index);
            });
        });
    });
    describe("pluck()", function () {
        it("should return the values for each item as an array for the given property", function () {
            basicSet.clear();
            basicSet.addMany([{
                    id: 16,
                    name: 'Dog'
                }, {
                    id: 18,
                    name: 'Cat'
                }, {
                    id: 19,
                    name: 'Lion'
                }]);
            var names = basicSet.pluck('name');
            expect(names[0]).toBe('Dog');
            expect(names[1]).toBe('Cat');
            expect(names[2]).toBe('Lion');
        });
    });
    describe("isEmpty()", function () {
        it("should return true if length of set is 0", function () {
            basicSet.clear();
            expect(basicSet.length).toBe(0);
            expect(basicSet.isEmpty()).toBe(true);
        });
    });
    describe("find()", function () {
        it("should return items that are allowed by listiterator", function () {
            basicSet.clear();
            basicSet.addMany([{
                    id: 1,
                    name: 'Lion'
                }, {
                    id: 2,
                    name: 'Panther'
                }, {
                    id: 3,
                    name: 'Leopard'
                }]);
            var found = basicSet.find(function (item) {
                return item.name !== 'Panther';
            });
            expect(found.length).toBe(2);
        });
    });
    describe("findFirst()", function () {
        it("should return the first item that is allowed by listiterator", function () {
            basicSet.clear();
            basicSet.addMany([{
                    id: 1,
                    name: 'Lion'
                }, {
                    id: 2,
                    name: 'Panther'
                }, {
                    id: 3,
                    name: 'Leopard'
                }]);
            var found = basicSet.findFirst(function (item) {
                return item.name.length > 4;
            });
            expect(found.name).toBe('Panther');
        });
    });
    describe("where()", function () {
        it("should return all items that have the properties given", function () {
            basicSet.clear();
            basicSet.addMany([{
                    id: 1,
                    name: 'Lion'
                }, {
                    id: 2,
                    name: 'Panther'
                }, {
                    id: 3,
                    name: 'Leopard'
                }, {
                    id: 3,
                    name: 'Leopard'
                }]);
            var found = basicSet.where({ id: 3, name: 'Leopard' });
            expect(found.length).toBe(2);
            expect(found[0].name).toBe('Leopard');
            expect(found[1].name).toBe('Leopard');
        });
    });
    describe("whereFirst()", function () {
        it("should return the first item that has the properties given", function () {
            basicSet.clear();
            basicSet.addMany([{
                    id: 1,
                    name: 'Lion'
                }, {
                    id: 2,
                    name: 'Panther'
                }, {
                    id: 3,
                    name: 'Leopard'
                }, {
                    id: 4,
                    name: 'Leopard'
                }]);
            var found = basicSet.whereFirst({ name: 'Leopard' });
            expect(found.id).toBe(3);
            expect(found.name).toBe('Leopard');
        });
    });
    describe("contains()", function () {
        it("should return true or false depending on the given item is in the set or not", function () {
            basicSet.clear();
            basicSet.add(animal1);
            expect(basicSet.contains(animal1)).toBe(true);
            expect(basicSet.contains(animal2)).toBe(false);
            basicSet.add(animal2);
            expect(basicSet.contains(animal2)).toBe(true);
            expect(basicSet.contains(animal3)).toBe(false);
        });
    });
    describe("toArray()", function () {
        it("should return an array that has the same items as the set has", function () {
            var animals = [animal1, animal2, animal3];
            basicSet.clear();
            basicSet.addMany(animals);
            var returned = basicSet.toArray();
            expect(animals).toEqual(returned);
        });
    });
    describe("constructor()", function () {
        it("should increase the size of the instance when passing data", function () {
            var dataSet = new TSCore.Data.Set([animal1, animal2]);
            expect(dataSet.length).toBe(2);
        });
        it("size of set should be zero when not passing data", function () {
            var dataSet = new TSCore.Data.Set();
            expect(dataSet.length).toBe(0);
        });
    });
    describe("clear()", function () {
        it("set should been empty when called", function () {
            var dataSet = new TSCore.Data.Set([animal1, animal2, animal3, animal4]);
            expect(dataSet.isEmpty()).toBe(false);
            dataSet.clear();
            expect(dataSet.isEmpty()).toBe(true);
        });
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.SortedCollection", function () {
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Events.EventEmitter", function () {
    var topicA = 'topicA';
    var topicB = 'topicB';
    var topicC = 'topicC';
    it("will call the callback each time the event is triggered", function () {
        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;
        emitter.on(topicB, function () {
            counter++;
        });
        emitter.on(topicB, function () {
            counter += 2;
        });
        emitter.on(topicA, function () {
            counter += 10;
        });
        emitter.on(topicA + ' ' + topicB, function () {
            counter += 10;
        });
        expect(counter).toBe(0);
        emitter.trigger(topicB);
        expect(counter).toBe(13);
        emitter.trigger(topicB);
        expect(counter).toBe(26);
        emitter.trigger(topicA);
        expect(counter).toBe(46);
        emitter.trigger(topicC);
        expect(counter).toBe(46);
        emitter.trigger(topicB);
        expect(counter).toBe(59);
    });
    it("will not call the callback after callback is unsubscribed", function () {
        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;
        var topicBCallback = function () {
            counter += 2;
        };
        var topicBContext = {
            context: 'topic B context'
        };
        var topicCCallback = function () {
            counter += 4;
        };
        var topicCContext = {
            context: 'topic C context'
        };
        emitter.on(topicA, function () {
            counter++;
        });
        emitter.on(topicB, topicBCallback, topicBContext);
        emitter.on(topicC, topicCCallback, topicCContext);
        expect(counter).toBe(0);
        emitter.trigger(topicA);
        expect(counter).toBe(1);
        emitter.trigger(topicB);
        expect(counter).toBe(3);
        emitter.off(topicA);
        emitter.trigger(topicA);
        expect(counter).toBe(3);
        emitter.trigger(topicB);
        expect(counter).toBe(5);
        emitter.trigger(topicC);
        expect(counter).toBe(9);
        emitter.off(topicB, topicBCallback);
        emitter.trigger(topicB);
        expect(counter).toBe(9);
        emitter.trigger(topicC);
        expect(counter).toBe(13);
        emitter.off(topicC, topicCCallback, topicCContext);
        emitter.trigger(topicC);
        expect(counter).toBe(13);
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Geometry.Size", function () {
    it("instance should have a valid width property", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.width).toBe(width);
    });
    it("instance should have a valid height property", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.height).toBe(height);
    });
    it("method halfHeight() should return height / 2", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.halfHeight()).toBe(height / 2);
    });
});
/// <reference path="../../TSCore.spec.ts" />
describe("TSCore.Logger.Stream.Console", function () {
    var logSpy = jasmine.createSpy('logSpy');
    var debugSpy = jasmine.createSpy('debugSpy');
    var infoSpy = jasmine.createSpy('infoSpy');
    var warnSpy = jasmine.createSpy('warnSpy');
    var errorSpy = jasmine.createSpy('errorSpy');
    var fakeConsole = {
        log: logSpy,
        debug: debugSpy,
        info: infoSpy,
        warn: warnSpy,
        error: errorSpy
    };
    beforeEach(function () {
        logSpy.calls.reset();
        debugSpy.calls.reset();
        infoSpy.calls.reset();
        warnSpy.calls.reset();
        errorSpy.calls.reset();
    });
    describe("exec()", function () {
        it("should not execute when level is higher", function () {
            var consoleStream = new TSCore.Logger.Stream.Console(fakeConsole);
            var logger = new TSCore.Logger.Logger();
            logger.setStream('console', consoleStream);
            logger.error('Test error');
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.calls.mostRecent().args[0]).toBe('Test error');
        });
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Text.Format", function () {
    describe("startsWith()", function () {
        it("should return true when source string starts with search string", function () {
            expect(TSCore.Text.Format.startsWith("Hello world", "Hello")).toBe(true);
            expect(TSCore.Text.Format.startsWith("Hello world", "Hello worl")).toBe(true);
            expect(TSCore.Text.Format.startsWith("Hello world", "Hello world")).toBe(true);
        });
        it("should return false when source string does not start with search string", function () {
            expect(TSCore.Text.Format.startsWith("Hell world", "Hello")).toBe(false);
            expect(TSCore.Text.Format.startsWith("Hell' world", "Hello worl")).toBe(false);
            expect(TSCore.Text.Format.startsWith("Hello forld", "Hello world")).toBe(false);
        });
    });
    describe("endsWith()", function () {
        it("should return true when source string ends with search string", function () {
            expect(TSCore.Text.Format.endsWith("Hello world", "rld")).toBe(true);
            expect(TSCore.Text.Format.endsWith("Hello world", "world")).toBe(true);
            expect(TSCore.Text.Format.endsWith("Hello&*world", "&*world")).toBe(true);
        });
        it("should return false when source string does not end with search string", function () {
            expect(TSCore.Text.Format.endsWith("Hell world", "al")).toBe(false);
            expect(TSCore.Text.Format.endsWith("Hell world", "srld")).toBe(false);
            expect(TSCore.Text.Format.endsWith("Hello forld", "Hello sl")).toBe(false);
        });
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Text.URL", function () {
    var host = "www.example.com";
    var basePath = "http://" + host + "/";
    var relativePath = "home/index";
    var path = basePath + relativePath;
    var url = new TSCore.Text.URL(path);
    it("should return valid host", function () {
        expect(url.host).toBe(host);
    });
    it("should return valid basePath", function () {
        expect(url.basePath).toBe(basePath);
    });
    it("should return valid relativePath", function () {
        expect(url.relativePath).toBe(relativePath);
    });
});
