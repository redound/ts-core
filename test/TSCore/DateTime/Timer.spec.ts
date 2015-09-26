/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

jasmine.clock().install();

describe("TSCore.DateTime.Timer", () => {


    // Initialize a set to test events on
    var timer:TSCore.DateTime.Timer = null;

    var callbackListener = jasmine.createSpy("Callback listener");

    // Setup for START
    var startListener = jasmine.createSpy("Events.START listener");
    var tickListener = jasmine.createSpy("Events.TICK listener");

    beforeEach(() => {

        // Prepare
        if(timer){
            timer.reset();
            timer.events.reset();
            timer = null;
        }

        callbackListener.calls.reset();
        startListener.calls.reset();
        tickListener.calls.reset();

        timer = new TSCore.DateTime.Timer(100, callbackListener, true);
        timer.events.on(TSCore.DateTime.Timer.Events.START, startListener);
        timer.events.on(TSCore.DateTime.Timer.Events.TICK, tickListener);
    });

    describe("start()", () => {

        it("should start the timer and fire the callback with increased tickCount", () => {

            timer.start();

            expect(callbackListener).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(callbackListener.calls.count()).toEqual(1);
            expect(callbackListener.calls.mostRecent().args[0]).toEqual(1);

            jasmine.clock().tick(101);
            expect(callbackListener.calls.count()).toEqual(2);
            expect(callbackListener.calls.mostRecent().args[0]).toEqual(2);
        });

        it("should start the timer and fire the TICK event with increased tickCount", () => {

            timer.start();

            expect(tickListener).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(tickListener.calls.count()).toEqual(1);
            expect(tickListener.calls.mostRecent().args[0].params.tickCount).toEqual(1);

            jasmine.clock().tick(101);
            expect(tickListener.calls.count()).toEqual(2);
            expect(tickListener.calls.mostRecent().args[0].params.tickCount).toEqual(2);
        });

        it("should start the timer and fire the START event", () => {

            expect(startListener).not.toHaveBeenCalled();
            timer.start();
            expect(startListener).toHaveBeenCalled();
        });
    });
});