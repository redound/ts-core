/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Text.Format", () => {

    describe("startsWith()", () => {

        it("should return true when source string starts with search string", () => {

            expect(TSCore.Text.Format.startsWith("Hello world", "Hello")).toBe(true);
            expect(TSCore.Text.Format.startsWith("Hello world", "Hello worl")).toBe(true);
            expect(TSCore.Text.Format.startsWith("Hello world", "Hello world")).toBe(true);
        });

        it("should return false when source string does not start with search string", () => {

            expect(TSCore.Text.Format.startsWith("Hell world", "Hello")).toBe(false);
            expect(TSCore.Text.Format.startsWith("Hell' world", "Hello worl")).toBe(false);
            expect(TSCore.Text.Format.startsWith("Hello forld", "Hello world")).toBe(false);
        });
    });

    describe("endsWith()", () => {

        it("should return true when source string ends with search string", () => {

            expect(TSCore.Text.Format.endsWith("Hello world", "rld")).toBe(true);
            expect(TSCore.Text.Format.endsWith("Hello world", "world")).toBe(true);
            expect(TSCore.Text.Format.endsWith("Hello&*world", "&*world")).toBe(true);
        });

        it("should return false when source string does not end with search string", () => {

            expect(TSCore.Text.Format.endsWith("Hell world", "al")).toBe(false);
            expect(TSCore.Text.Format.endsWith("Hell world", "srld")).toBe(false);
            expect(TSCore.Text.Format.endsWith("Hello forld", "Hello sl")).toBe(false);
        });
    });
});