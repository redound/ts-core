/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect;

describe("TSCore.Geometry.Size", () => {

    it("instance should have a valid width property", () => {

        var width = 10;
        var height = 20;

        var size = new TSCore.Geometry.Size(width, height);

        expect(size.width).toBe(width);
    });

    it("instance should have a valid height property", () => {

        var width = 10;
        var height = 20;

        var size = new TSCore.Geometry.Size(width, height);

        expect(size.height).toBe(height);
    });

    it("method halfHeight() should return height / 2", () => {

        var width = 10;
        var height = 20;

        var size = new TSCore.Geometry.Size(width, height);

        expect(size.halfHeight()).toBe(height / 2);
    });
});