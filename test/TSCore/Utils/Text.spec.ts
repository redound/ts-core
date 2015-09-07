/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Utils.Text", () => {

    describe("startsWith()", () => {

        it("should return true when source Text starts with search Text", () => {

            expect(TSCore.Utils.Text.startsWith("Hello world", "Hello")).toBe(true);
            expect(TSCore.Utils.Text.startsWith("Hello world", "Hello worl")).toBe(true);
            expect(TSCore.Utils.Text.startsWith("Hello world", "Hello world")).toBe(true);
        });

        it("should return false when source Text does not start with search Text", () => {

            expect(TSCore.Utils.Text.startsWith("Hell world", "Hello")).toBe(false);
            expect(TSCore.Utils.Text.startsWith("Hell' world", "Hello worl")).toBe(false);
            expect(TSCore.Utils.Text.startsWith("Hello forld", "Hello world")).toBe(false);
        });
    });

    describe("endsWith()", () => {

        it("should return true when source Text ends with search Text", () => {

            expect(TSCore.Utils.Text.endsWith("Hello world", "rld")).toBe(true);
            expect(TSCore.Utils.Text.endsWith("Hello world", "world")).toBe(true);
            expect(TSCore.Utils.Text.endsWith("Hello&*world", "&*world")).toBe(true);
        });

        it("should return false when source Text does not end with search Text", () => {

            expect(TSCore.Utils.Text.endsWith("Hell world", "al")).toBe(false);
            expect(TSCore.Utils.Text.endsWith("Hell world", "srld")).toBe(false);
            expect(TSCore.Utils.Text.endsWith("Hello forld", "Hello sl")).toBe(false);
        });
    });
});