/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Data.Collection", () => {

    /** Setup for items **/
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

    // Initialize a set to test events on
    var collection = new TSCore.Data.Collection<IAnimal>();

    // Setup for testing CollectionEvents.ADD
    var addListener = jasmine.createSpy("CollectionEvents.ADD listener");
    collection.on(TSCore.Data.CollectionEvents.ADD, addListener);

    // Setup for testing CollectionEvents.ADD
    var changeListener = jasmine.createSpy("CollectionEvents.CHANGE listener");
    collection.on(TSCore.Data.CollectionEvents.CHANGE, changeListener);

    // Setup for testing CollectionEvents.REMOVE
    var removeListener = jasmine.createSpy("CollectionEvents.REMOVE listener");
    collection.on(TSCore.Data.CollectionEvents.REMOVE, removeListener);

    // Setup for testing CollectionEvents.REPLACE
    var replaceListener = jasmine.createSpy("CollectionEvents.REPLACE listener");
    collection.on(TSCore.Data.CollectionEvents.REPLACE, replaceListener);

    // Setup for testing CollectionEvents.REMOVE
    var clearListener = jasmine.createSpy("CollectionEvents.CLEAR listener");
    collection.on(TSCore.Data.CollectionEvents.CLEAR, clearListener);

    beforeEach(() => {

        // Prepare
        collection.clear();
        addListener.calls.reset();
        changeListener.calls.reset();
    });

    describe("prepend()", () => {

        it("should prepend the collection with given item", () => {

            // Prepare
            collection.addMany([animal2, animal3, animal4]);

            // Test
            collection.prepend(animal1);
            expect(collection.first()).toEqual(animal1);

            collection.prepend(animal3);
            expect(collection.first()).toEqual(animal3);
        });

        it("should fire CollectionEvents.ADD containing the prepended item", () => {

            // Test
            collection.prepend(animal1);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items[0]).toEqual(animal1);
            collection.prepend(animal2);
            expect(addListener.calls.count()).toBe(2);
        });

        it("should fire CollectionEvents.CHANGE", () => {

            // Test
            collection.prepend(animal1);
            expect(changeListener).toHaveBeenCalled();
            collection.prepend(animal2);
            expect(changeListener.calls.count()).toBe(2);
        })
    });

    describe("prependMany()", () => {

        it("should prepend the collection with given items", () => {

            // Prepare
            collection.addMany([animal4]);

            // Test
            collection.prependMany([animal3, animal2, animal1]);
            expect(collection.get(0)).toEqual(animal3);
            expect(collection.get(1)).toEqual(animal2);
            expect(collection.get(2)).toEqual(animal1);
        });

        it("should fire CollectionEvents.ADD containing the prepended item", () => {

            // Prepare
            var animals = [animal1, animal2, animal3];

            // Test
            collection.prepend(animal4);
            collection.prependMany(animals);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items).toEqual(animals);
        });

        it("should fire CollectionEvents.CHANGE exactly once", () => {

            // Prepare
            var animals = [animal1, animal2, animal3];

            // Test
            collection.prependMany(animals);
            expect(changeListener).toHaveBeenCalled();
            collection.prepend(animal2);
            expect(changeListener.calls.count()).toBe(2);
        })
    });

    describe("insert()", () => {

        it("should insert given item at given index", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            collection.insert(animal4, 2);
            expect(collection.get(2)).toEqual(animal4);
        });

        it("should fire CollectionEvents.ADD containing the inserted item", () => {

            // Prepare
            collection.addMany([animal2, animal3, animal4]);

            // Test
            collection.insert(animal1, 2);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.items[0]).toEqual(animal1);
        });

        it("should fire CollectionEvents.CHANGE", () => {

            // Prepare
            var animals = [animal1, animal2, animal3];

            // Test
            collection.prependMany(animals);
            expect(changeListener).toHaveBeenCalled();
            collection.insert(animal2, 2);
            expect(changeListener.calls.count()).toBe(2);
        });
    });

    describe("replaceItem()", () => {

        it("should replace a given item for another given item", () => {

        });

        it("should fire CollectionEvents.REPLACE containing the source and the replacement", () => {

        });

        it("should fire CollectionEvents.CHANGE", () => {

        });
    });

    describe("replace()", () => {

        it("should replace given item at given index in the collection", () => {

        });

        it("should fire CollectionEvents.REPLACE containing the source and the replacement", () => {

        });

        it ("should fire CollectionEvents.CHANGE", () => {

        });
    });

    describe("first()", () => {

        it("should return the first item out of the collection", () => {

        });
    });

    describe("last()", () => {

        it("should return the last item out of the collection", () => {

        });
    });

    describe("get()", () => {

        it("should return the item in collection at the given index", () => {

        });
    });

    describe("indexOf()", () => {

        it("should return the index of given item in collection", () => {

        });
    });

});