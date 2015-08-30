/// <reference path="../../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Logger.Stream.Console", () => {

    var logSpy = jasmine.createSpy('logSpy');
    var debugSpy = jasmine.createSpy('debugSpy');
    var infoSpy = jasmine.createSpy('infoSpy');
    var warnSpy = jasmine.createSpy('warnSpy');
    var errorSpy = jasmine.createSpy('errorSpy');

    var fakeConsole = {
        log: logSpy,
        debug: debugSpy,
        info: infoSpy,
        warn: warnSpy,
        error: errorSpy
    };

    beforeEach(() => {
        logSpy.calls.reset();
        debugSpy.calls.reset();
        infoSpy.calls.reset();
        warnSpy.calls.reset();
        errorSpy.calls.reset();
    })

    describe("exec()", () => {

        it("should not execute when level is higher", () => {

            var consoleStream = new TSCore.Logger.Stream.Console(fakeConsole);
            var logger = new TSCore.Logger.Logger();
            logger.setStream('console', consoleStream);

            logger.error('Test error');
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.calls.mostRecent().args[0]).toBe('Test error');
        })
    });
});