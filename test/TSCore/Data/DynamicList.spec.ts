/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Data.DynamicList", () => {

    beforeEach(() => {

    });

    describe("setRange()", () => {

        it("should set item range at start index", () => {

            var dynamicList = new TSCore.Data.DynamicList;
            dynamicList.setRange(0, [1,2,3,4,5]);

            expect(dynamicList.count()).toEqual(5);

            dynamicList.setRange(15, [1,2,3,4,5]);

            expect(dynamicList.count()).toEqual(20);

            expect(dynamicList.get(13)).toEqual(null);
        });
    });

    describe("containsRange()", () => {

        it("should", () => {

            var dynamicList = new TSCore.Data.DynamicList;
            dynamicList.setRange(0, [1,2,3,4,5]);

            expect(dynamicList.containsRange(0, 5)).toEqual(true);
            expect(dynamicList.containsRange(0, 7)).toEqual(false);

            dynamicList.setRange(15, [1,2,3,4,5]);

            expect(dynamicList.containsRange(12, 5)).toEqual(false);

            expect(dynamicList.containsRange(15, 5)).toEqual(true);

            dynamicList.setRange(20, [1,2,3,4,5]);

            expect(dynamicList.containsRange(15, 10)).toEqual(true);
        });
    });

    describe("getRange()", () => {

        it("should", () => {

            var dynamicList = new TSCore.Data.DynamicList;
            dynamicList.setRange(10, [1,2,3,4,5]);

            expect(dynamicList.getRange(10, 5)).toEqual([1,2,3,4,5]);
        });

    });
});