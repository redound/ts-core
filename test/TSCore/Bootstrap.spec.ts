/// <reference path="TSCore.spec.ts" />
/// <reference path="./Mocks/Bootstrap.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Bootstrap", () => {


    it("should call each method starting with '_init'", () => {

        var bootstrap = new Mocks.Bootstrap();
        expect(bootstrap.configSpy).not.toHaveBeenCalled();
        expect(bootstrap.loggerSpy).not.toHaveBeenCalled();
        expect(bootstrap.authManagerSpy).not.toHaveBeenCalled();
        bootstrap.init();
        expect(bootstrap.configSpy).toHaveBeenCalled();
        expect(bootstrap.loggerSpy).toHaveBeenCalled();
        expect(bootstrap.authManagerSpy).toHaveBeenCalled();
    });
});