/// <reference path="TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.DI", () => {

    var di = new TSCore.DI();

    beforeEach(() => {

        di.reset();
    });

    describe("set()", () => {

        it("should be able to resolve a function", () => {

            di.set('logger', () => {

                return 'resolvedValue';
            });

            expect(di.get('logger')).toEqual('resolvedValue');
        });

        it("should be able to return the value if it's not a function", () => {

            di.set('logger', 'value');
            expect(di.get('logger')).toEqual('value');
        });
    });

    describe("setShared()", () => {

        it("should cause get() to always resolve the same value", () => {

            var listener = jasmine.createSpy();
            di.setShared('logger', () => {

                listener();
                return 'value';
            });

            di.get('logger');
            di.get('logger');
            expect(listener).toHaveBeenCalled();
            expect(listener.calls.count()).toBe(1);
        });
    });

    describe("get()", () => {

        it("should always return a new instance", () => {

            var listener = jasmine.createSpy();
            di.set('bike', () => {
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

    describe("getShared()", () => {

        it("should always return the same instance", () => {

            function Car() {

                this.hasDriver = false;
            }

            var listener = jasmine.createSpy();
            di.set('car', () => {

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

    describe("reset()", () => {

        it("after being called services should be cleared", () => {

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