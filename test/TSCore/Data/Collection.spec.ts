/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine;

import CollectionEvents = TSCore.Data.CollectionEvents;

describe("TSCore.Data.Collection", () => {

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

    /** Setup basic set **/
    var basicSet = new TSCore.Data.Collection<IAnimal>();

    /** Setup for testing events **/
    // Initialize a set to test events on
    var eventSet = new TSCore.Data.Collection<IAnimal>();

    // Setup for testing SetEvents.ADD
    var addListener = jasmine.createSpy("CollectionEvents.ADD listener");
    eventSet.events.on(CollectionEvents.ADD, addListener);

    // Setup for testing SetEvents.ADD
    var changeListener = jasmine.createSpy("CollectionEvents.CHANGE listener");
    eventSet.events.on(CollectionEvents.CHANGE, changeListener);

    // Setup for testing SetEvents.REMOVE
    var removeListener = jasmine.createSpy("CollectionEvents.REMOVE listener");
    eventSet.events.on(CollectionEvents.REMOVE, removeListener);

    // Setup for testing SetEvents.REPLACE
    var replaceListener = jasmine.createSpy("CollectionEvents.REPLACE listener");
    eventSet.events.on(CollectionEvents.REPLACE, replaceListener);

    // Setup for testing SetEvents.REMOVE
    var clearListener = jasmine.createSpy("CollectionEvents.CLEAR listener");
    eventSet.events.on(CollectionEvents.CLEAR, clearListener);

    describe("General", () => {

        /**
         * TODO: Should it be able to contain same objects?
         */
        it("can contain same objects (allows duplicates)", () => {

            // Prepare
            basicSet.clear();

            // Test
            expect(basicSet.length).toBe(0);
            basicSet.addMany([animal1, animal2, animal3]);
            expect(basicSet.length).toBe(3);
        });
    });

    describe("add()", () => {

        it("should add an item to collection", () => {

            // Prepare
            basicSet.clear();

            // Test
            expect(basicSet.length).toBe(0);
            basicSet.add(animal1);
            expect(basicSet.length).toBe(1);
        });

        it("should increase the size of the instance", () => {

            // Prepare
            var animals = [animal1, animal2, animal3, animal4];
            basicSet.clear();

            // Test
            /**
             * By each time we add an item
             * to the set we expect the dataSet's length
             * to increase.
             */
            for(var i = 0; i < animals.length; i++) {

                var animal = animals[i];
                basicSet.add(animal);

                expect(basicSet.length).toBe(i + 1);
            }
        });

        it("should fire CollectionEvents.ADD", () => {

            // Prepare
            eventSet.clear();
            addListener.calls.reset();

            // Test
            eventSet.add(animal1);
            expect(addListener).toHaveBeenCalled();
        });

        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            eventSet.clear();
            changeListener.calls.reset();

            // Test
            eventSet.add(animal1);
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("addMany()", () => {

        it("should add multiple items", () => {

            // Prepare
            basicSet.clear();

            // Test
            expect(basicSet.length).toBe(0);
            basicSet.addMany([animal1, animal2]);

            expect(basicSet.length).toBe(2);
        });

        it("should fire CollectionEvents.ADD", () => {

            // Prepare
            eventSet.clear();
            addListener.calls.reset();

            // Test
            eventSet.addMany([animal1, animal2]);
            expect(addListener).toHaveBeenCalled();
        });


        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            eventSet.clear();
            changeListener.calls.reset();

            // Test
            eventSet.addMany([animal1, animal2]);
            expect(changeListener).toHaveBeenCalled();
        });

    });

    describe("remove()", () => {

        it("should remove remove all instances of object (also when it has duplicates)", () => {

            // Prepare
            basicSet.clear();
            basicSet.addMany([animal1, animal1, animal2]);

            // Test
            expect(basicSet.length).toBe(3);
            basicSet.remove(animal1);
            expect(basicSet.length).toBe(1);
        });

        it("should decrease the size of the instance", () => {

            // Prepare
            var animals = [animal1, animal2, animal3, animal4];
            var dataSet = new TSCore.Data.Collection<IAnimal>(animals);

            // Test
            /**
             * By each time we add an item
             * to the set we expect the dataSet's length
             * to increase.
             */
            for(var i = 0; i < animals.length; i++) {

                var animal = animals[i];
                dataSet.remove(animal);

                expect(dataSet.length).toBe(animals.length - (i + 1));
            }
        });

        it("should fire CollectionEvents.REMOVE", () => {

            // Prepare
            eventSet.clear();
            eventSet.add(animal1);
            removeListener.calls.reset();

            // Test
            eventSet.remove(animal1);
            expect(removeListener).toHaveBeenCalled();
        });


        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            changeListener.calls.reset();

            // Test
            eventSet.remove(animal1);
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("removeMany()", () => {

        it("should remove multiple items including duplicates", () => {

            // Prepare
            basicSet.clear();
            basicSet.addMany([animal1, animal1, animal2, animal3]);

            // Test
            expect(basicSet.length).toBe(4);
            basicSet.removeMany([animal1, animal2]);
            expect(basicSet.length).toBe(1);
            basicSet.removeMany([animal3]);
            expect(basicSet.length).toBe(0);
        });

        it("should fire CollectionEvents.REMOVE", () => {

            // Prepare
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            removeListener.calls.reset();

            // Test
            eventSet.removeMany([animal1, animal2]);
            expect(removeListener).toHaveBeenCalled();
        });


        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            eventSet.clear();
            eventSet.addMany([animal1, animal2, animal3]);
            changeListener.calls.reset();

            // Test
            eventSet.removeMany([animal1, animal2]);
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("removeWhere()", () => {

        it("should remove single or multiple items from set based on properties", () => {

            // Prepare
            basicSet.clear();
            basicSet.addMany([animal1, animal2, animal3, {
                id: 15,
                name: 'Sheep'
            }]);

            // Test Single
            expect(basicSet.length).toBe(4);
            basicSet.removeWhere({ name: 'Sheep' });
            expect(basicSet.length).toBe(3);

            // Test multiple
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

        it("should fire CollectionEvents.REMOVE", () => {

            // Prepare
            eventSet.clear();
            eventSet.addMany([{
                id: 1,
                name: 'Fish'
            }, {
                id: 2,
                name: 'Fish'
            }]);
            removeListener.calls.reset();

            // Test
            eventSet.removeWhere({ name: 'Fish' });
            expect(removeListener).toHaveBeenCalled();
        });

        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            eventSet.clear();
            eventSet.addMany([{
                id: 1,
                name: 'Fish'
            }, {
                id: 2,
                name: 'Fish'
            }]);
            changeListener.calls.reset();

            // Test
            eventSet.removeWhere({ name: 'Fish' });
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("replaceItem()", () => {

        it("should replace one item for another", () => {

            // Prepare
            basicSet.clear();
            basicSet.add(animal1);

            // Test
            var replacedItem = basicSet.replaceItem(animal1, animal2);
            expect(replacedItem).toBe(animal1);
        });

        it("should only return the item when it gets replaced", () => {

            // Prepare
            basicSet.clear();

            // Test
            var replacedItem = basicSet.replaceItem(animal1, animal2);
            expect(replacedItem).toBe(null);
        })
    });

    describe("count()", () => {

        it("should alias magic getter for this._data.length", () => {

            // Initialize an empty set
            var dataSet = new TSCore.Data.Collection<IAnimal>();

            // Add one animal
            dataSet.add(animal1);

            // Expect: length as well as count() to be 1
            expect(dataSet.length).toBe(1);
            expect(dataSet.count()).toBe(1);

            // Add another animal
            dataSet.add(animal2);

            // Expect: length as well as count() to be 2
            expect(dataSet.length).toBe(2);
            expect(dataSet.length).toBe(2);
        });
    });

    describe("each()", () => {

        it("should iterate over each item", () => {

            // Prepare
            var animals = [animal1, animal2, animal3, animal4];
            basicSet.clear();
            basicSet.addMany(animals);

            // Test
            basicSet.each((item) => {

                var index = animals.indexOf(item);
                expect(( index > -1 )).toBe(true);
                animals.splice(0, index);
            });
        });
    });

    describe("pluck()", () => {

        it("should return the values for each item as an array for the given property", () => {

            // Prepare
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

            // Test
            var namesCollection = basicSet.pluck('name');
            var names = namesCollection.toArray();
            expect(names[0]).toBe('Dog');
            expect(names[1]).toBe('Cat');
            expect(names[2]).toBe('Lion');
        });
    });

    describe("isEmpty()", () => {

        it("should return true if length of set is 0", () => {

            // Prepare
            basicSet.clear();

            // Test
            expect(basicSet.length).toBe(0);
            expect(basicSet.isEmpty()).toBe(true);
        });
    });

    describe("filter()", () => {

        it("should return items that are allowed by listiterator", () => {

            // Prepare
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

            // Test
            var found = basicSet.filter((item) => {

                return item.name !== 'Panther';
            });

            expect(found.length).toBe(2);
        });

        it("should be optional", () => {

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

            // Test
            var found = basicSet.filter();
            expect(found.length).toBe(3);
        });
    });

    describe("find()", () => {

        it("should return the first item that is allowed by listiterator", () => {

            // Prepare
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

            // Test
            var found = basicSet.find((item) => {

                return item.name.length > 4;
            });

            expect(found.name).toBe('Panther');
        });
    });

    describe("where()", () => {

        it("should return all items that have the properties given", () => {

            // Prepare
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

            // Test
            var found = basicSet.where({ id: 3, name: 'Leopard' });
            expect(found.length).toBe(2);
            expect(found[0].name).toBe('Leopard');
            expect(found[1].name).toBe('Leopard');
        });
    });

    describe("whereFirst()", () => {

        it("should return the first item that has the properties given", () => {

            // Prepare
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

            // Test
            var found = basicSet.whereFirst({ name: 'Leopard' });
            expect(found.id).toBe(3);
            expect(found.name).toBe('Leopard');
        });
    });

    describe("contains()", () => {

        it("should return true or false depending on the given item is in the set or not", () => {

            // Prepare
            basicSet.clear();
            basicSet.add(animal1);

            // Test
            expect(basicSet.contains(animal1)).toBe(true);
            expect(basicSet.contains(animal2)).toBe(false);
            basicSet.add(animal2);
            expect(basicSet.contains(animal2)).toBe(true);
            expect(basicSet.contains(animal3)).toBe(false);
        });
    });

    describe("toArray()", () => {

        it("should return an array that has the same items as the set has", () => {

            // Prepare
            var animals = [animal1, animal2, animal3];
            basicSet.clear();
            basicSet.addMany(animals);

            // Test
            var returned = basicSet.toArray();
            expect(animals).toEqual(returned);
        });
    });

    describe("constructor()", () => {

        it("should increase the size of the instance when passing data", () => {

            // Initialize set with two animals
            var dataSet = new TSCore.Data.Collection<IAnimal>([animal1, animal2]);

            // Expect: length to be 2
            expect(dataSet.length).toBe(2);
        });

        it("size of set should be zero when not passing data", () => {

            // Initialize empty set
            var dataSet = new TSCore.Data.Collection<IAnimal>();

            // Expect: length to be 0
            expect(dataSet.length).toBe(0);
        });
    });

    describe("clear()", () => {

        it("set should been empty when called", () => {

            var dataSet = new TSCore.Data.Collection<IAnimal>([animal1, animal2, animal3, animal4]);

            expect(dataSet.isEmpty()).toBe(false);
            dataSet.clear();
            expect(dataSet.isEmpty()).toBe(true);
        });
    });
});