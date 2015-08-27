/// <reference path="../../build/tscore.d.ts" /> 
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Events.EventEmitter", function () {
    var topicA = 'topicA';
    var topicB = 'topicB';
    var topicC = 'topicC';
    it("will call the callback each time the event is triggered", function () {
        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;
        emitter.on(topicB, function () {
            counter++;
        });
        emitter.on(topicB, function () {
            counter += 2;
        });
        emitter.on(topicA, function () {
            counter += 10;
        });
        emitter.on(topicA + ' ' + topicB, function () {
            counter += 10;
        });
        expect(counter).toBe(0);
        emitter.trigger(topicB);
        expect(counter).toBe(13);
        emitter.trigger(topicB);
        expect(counter).toBe(26);
        emitter.trigger(topicA);
        expect(counter).toBe(46);
        emitter.trigger(topicC);
        expect(counter).toBe(46);
        emitter.trigger(topicB);
        expect(counter).toBe(59);
    });
    it("will not call the callback after callback is unsubscribed", function () {
        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;
        var topicBCallback = function () {
            counter += 2;
        };
        var topicBContext = {
            context: 'topic B context'
        };
        var topicCCallback = function () {
            counter += 4;
        };
        var topicCContext = {
            context: 'topic C context'
        };
        emitter.on(topicA, function () {
            counter++;
        });
        emitter.on(topicB, topicBCallback, topicBContext);
        emitter.on(topicC, topicCCallback, topicCContext);
        expect(counter).toBe(0);
        emitter.trigger(topicA);
        expect(counter).toBe(1);
        emitter.trigger(topicB);
        expect(counter).toBe(3);
        emitter.off(topicA);
        emitter.trigger(topicA);
        expect(counter).toBe(3);
        emitter.trigger(topicB);
        expect(counter).toBe(5);
        emitter.trigger(topicC);
        expect(counter).toBe(9);
        emitter.off(topicB, topicBCallback);
        emitter.trigger(topicB);
        expect(counter).toBe(9);
        emitter.trigger(topicC);
        expect(counter).toBe(13);
        emitter.off(topicC, topicCCallback, topicCContext);
        emitter.trigger(topicC);
        expect(counter).toBe(13);
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Geometry.Size", function () {
    it("instance should have a valid width property", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.width).toBe(width);
    });
    it("instance should have a valid height property", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.height).toBe(height);
    });
    it("method halfHeight() should return height / 2", function () {
        var width = 10;
        var height = 20;
        var size = new TSCore.Geometry.Size(width, height);
        expect(size.halfHeight()).toBe(height / 2);
    });
});
/// <reference path="../TSCore.spec.ts" />
describe("TSCore.Text.URL", function () {
    var host = "www.example.com";
    var basePath = "http://" + host + "/";
    var relativePath = "home/index";
    var path = basePath + relativePath;
    var url = new TSCore.Text.URL(path);
    it("should return valid host", function () {
        expect(url.host).toBe(host);
    });
    it("should return valid basePath", function () {
        expect(url.basePath).toBe(basePath);
    });
    it("should return valid relativePath", function () {
        expect(url.relativePath).toBe(relativePath);
    });
});
