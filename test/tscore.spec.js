/// <reference path="../../build/tscore.d.ts" /> 
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Data.Collection", function () {
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
var IAnimal = (function () {
    function IAnimal() {
    }
    return IAnimal;
})();
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
var addListener = jasmine.createSpy("SetEvents.Add listener");
eventSet.on(TSCore.Data.SetEvents.ADD, addListener);
var changeListener = jasmine.createSpy("SetEvents.CHANGE listener");
eventSet.on(TSCore.Data.SetEvents.CHANGE, changeListener);
var removeListener = jasmine.createSpy("SetEvents.REMOVE listener");
eventSet.on(TSCore.Data.SetEvents.REMOVE, removeListener);
var replaceListener = jasmine.createSpy("SetEvents.REPLACE listener");
eventSet.on(TSCore.Data.SetEvents.REPLACE, replaceListener);
var clearListener = jasmine.createSpy("SetEvents.CLEAR listener");
eventSet.on(TSCore.Data.SetEvents.CLEAR, clearListener);
describe("TSCore.Data.Set", function () {
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
            expect(JSON.stringify(animals) === JSON.stringify(returned)).toBe(true);
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
