/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

import ListEvents = TSCore.Data.ListEvents;

describe("TSCore.Data.List", () => {

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
    var collection = new TSCore.Data.List<IAnimal>();

    // Setup for testing CollectionEvents.ADD
    var addListener = jasmine.createSpy("ListEvents.ADD listener");
    collection.events.on(ListEvents.ADD, addListener);

    // Setup for testing CollectionEvents.ADD
    var changeListener = jasmine.createSpy("ListEvents.CHANGE listener");
    collection.events.on(ListEvents.CHANGE, changeListener);

    // Setup for testing CollectionEvents.REMOVE
    var removeListener = jasmine.createSpy("ListEvents.REMOVE listener");
    collection.events.on(ListEvents.REMOVE, removeListener);

    // Setup for testing CollectionEvents.REPLACE
    var replaceListener = jasmine.createSpy("ListEvents.REPLACE listener");
    collection.events.on(ListEvents.REPLACE, replaceListener);

    // Setup for testing CollectionEvents.REMOVE
    var clearListener = jasmine.createSpy("ListEvents.CLEAR listener");
    collection.events.on(ListEvents.CLEAR, clearListener);

    beforeEach(() => {

        // Prepare
        collection.clear();
        addListener.calls.reset();
        changeListener.calls.reset();
        removeListener.calls.reset();
        replaceListener.calls.reset();
        clearListener.calls.reset();
    });

    describe("prepend()", () => {

        it("should prepend the list with given item", () => {

            // Prepare
            collection.addMany([animal2, animal3, animal4]);

            // Test
            collection.prepend(animal1);
            expect(collection.first()).toEqual(animal1);

            collection.prepend(animal3);
            expect(collection.first()).toEqual(animal3);
        });

        it("should fire ListEvents.ADD containing the prepended item", () => {

            // Test
            collection.prepend(animal1);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.operations[0].item).toEqual(animal1);
            collection.prepend(animal2);
            expect(addListener.calls.count()).toBe(2);
        });

        it("should fire ListEvents.CHANGE", () => {

            // Test
            collection.prepend(animal1);
            expect(changeListener).toHaveBeenCalled();
            collection.prepend(animal2);
            expect(changeListener.calls.count()).toBe(2);
        })
    });

    describe("prependMany()", () => {

        it("should prepend the list with given items", () => {

            // Prepare
            collection.addMany([animal4]);

            // Test
            collection.prependMany([animal3, animal2, animal1]);
            expect(collection.get(0)).toEqual(animal3);
            expect(collection.get(1)).toEqual(animal2);
            expect(collection.get(2)).toEqual(animal1);
        });

        //it("should fire ListEvents.ADD containing the prepended item", () => {
        //
        //    // Prepare
        //    var animals = [animal1, animal2, animal3];
        //
        //    // Test
        //    collection.prepend(animal4);
        //    collection.prependMany(animals);
        //    expect(addListener).toHaveBeenCalled();
        //    expect(addListener.calls.mostRecent().args[0].params.operations).toEqual(animals);
        //});

        it("should fire ListEvents.CHANGE exactly once", () => {

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

        it("should fire ListEvents.ADD containing the inserted item", () => {

            // Prepare
            collection.addMany([animal2, animal3, animal4]);

            // Test
            collection.insert(animal1, 2);
            expect(addListener).toHaveBeenCalled();
            expect(addListener.calls.mostRecent().args[0].params.operations[0].item).toEqual(animal1);
        });

        it("should fire ListEvents.CHANGE", () => {

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

            // Prepare
            collection.addMany([animal1, animal4, animal3]);

            // Test
            collection.replaceItem(animal4, animal2);
            expect(collection.contains(animal2)).toBe(true);
            expect(collection.get(1)).toEqual(animal2);
        });

        it("should fire ListEvents.REPLACE containing the source and the replacement", () => {

            // Prepare
            collection.addMany([animal1, animal3]);

            // Test
            expect(replaceListener).not.toHaveBeenCalled();
            collection.replaceItem(animal3, animal2);
            expect(replaceListener).toHaveBeenCalled();
            expect(replaceListener.calls.mostRecent().args[0].params.source).toEqual(animal3);
            expect(replaceListener.calls.mostRecent().args[0].params.replacement).toEqual(animal2);
        });

        it("should fire ListEvents.CHANGE", () => {

            // Prepare
            collection.addMany([animal1, animal3]);
            changeListener.calls.reset();

            // Test
            expect(changeListener).not.toHaveBeenCalled();
            collection.replaceItem(animal3, animal2);
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("replace()", () => {

        it("should replace given item at given index in the collection", () => {

            // Prepare
            collection.addMany([animal1, animal2]);

            // Test
            collection.replace(1, animal3);
            expect(collection.get(1)).toEqual(animal3);
        });

        it("should not allow replacing an empty index", () => {

            // Prepare
            collection.addMany([animal1, animal2]);

            // Test
            collection.replace(20, animal4);
            expect(collection.get(20)).not.toEqual(animal4);
        });

        it("should fire ListEvents.REPLACE containing the source and the replacement", () => {

            // Prepare
            collection.addMany([animal1, animal2]);

            // Test
            collection.replace(0, animal3);
            expect(replaceListener).toHaveBeenCalled();
            expect(replaceListener.calls.mostRecent().args[0].params.source).toEqual(animal1);
            expect(replaceListener.calls.mostRecent().args[0].params.replacement).toEqual(animal3);
        });

        it ("should fire ListEvents.CHANGE", () => {

            // Prepare
            collection.addMany([animal1, animal2]);
            changeListener.calls.reset();

            // Test
            expect(changeListener).not.toHaveBeenCalled();
            collection.replace(0, animal3);
            expect(changeListener).toHaveBeenCalled();
        });
    });

    describe("first()", () => {

        it("should return the first item out of the list", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            expect(collection.first()).toEqual(animal1);
        });
    });

    describe("last()", () => {

        it("should return the last item out of the list", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            expect(collection.last()).toEqual(animal3);
        });
    });

    describe("get()", () => {

        it("should return the item in list at the given index", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            expect(collection.get(1)).toEqual(animal2);
        });
    });

    describe("indexOf()", () => {

        it("should return the index of given item in list", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            expect(collection.indexOf(animal3)).toBe(2);
        });
    });

    describe("clear()", () => {

        it("should fire ListEvents.CLEAR", () => {

            // Prepare
            collection.addMany([animal1, animal2, animal3]);

            // Test
            expect(clearListener).not.toHaveBeenCalled();
            collection.clear();
            expect(clearListener).toHaveBeenCalled();
        });
    });
});