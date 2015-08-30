/// <reference path="TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Config", () => {

    var config = new TSCore.Config();

    beforeEach(() => {

        config.clear();
    });

    describe("constructor()", () => {

        it("should load data when given", () => {

            var config = new TSCore.Config({
                value1: true,
                value2: true
            });

            expect(config.has('value1')).toBe(true);
            expect(config.has('value2')).toBe(true);
            expect(config.has('value3')).toBe(false);
        });
    });

    describe("clear()", () => {

        it("when given a key it should remove it", () => {

            config.load({
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                }
            });

            // Root
            expect(config.get('value1')).toBe('Door');
            expect(config.get('value2')).toBe('Window');
            config.clear('value2');
            expect(config.get('value1')).toBe('Door');
            expect(config.get('value2')).toBe(null);

            // Nested
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

        it("should clear all loaded properties", () => {

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

    describe("set()", () => {

        it("given value should be available through the given key using get()", () => {

            config.set('level1.level2.level3', 'value');

            expect(config.get('level1')).not.toBe(null);
            expect(config.get('level1.level2')).not.toBe(null);
            expect(config.get('level1.level2.level3')).not.toBe(null);
            expect(config.get('level1.level2.level3')).toBe('value');
        });
    });

    describe("get()", () => {

        it("depending whether there's a value set for the given key it should return the value or null", () => {

            var data = {
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                },
                level1: {
                    level2: {
                        level3: {

                        }
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

    describe("has()", () => {

        it("should return true or false depending on whether the (nested) property exists or not", () => {

            config.load({
                value1: 'Door',
                value2: 'Window',
                settings: {
                    open: true,
                    locked: false,
                },
                level1: {
                    level2: {
                        level3: {

                        }
                    }
                }
            });

            expect(config.has('level1.level2.level3')).toBe(true);
            expect(config.has('level1.level2.level3.level4')).toBe(false);

        });
    });
});