/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect;

describe("TSCore.Utils.URL", () => {

    var host = "www.example.com";
    var basePath = "http://" + host + "/";
    var relativePath = "home/index";
    var path = basePath + relativePath;

    var url = new TSCore.Utils.URL(path);

    it("should return valid host", () => {

        expect(url.host).toBe(host);
    });

    it("should return valid basePath", () => {

        expect(url.basePath).toBe(basePath);
    });

    it("should return valid relativePath", () => {

        expect(url.relativePath).toBe(relativePath);
    });
});