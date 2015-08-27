/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect;

describe("TSCore.Events.EventEmitter", () => {

    var topicA = 'topicA';
    var topicB = 'topicB';
    var topicC = 'topicC';

    it("will call the callback each time the event is triggered", () => {

        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;

        emitter.on(topicB, () => {
            counter++;
        });
        emitter.on(topicB, () => {
            counter += 2;
        });
        emitter.on(topicA, () => {
            counter += 10;
        });
        emitter.on(topicA + ' ' + topicB, () => {
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


    it("will not call the callback after callback is unsubscribed", () => {

        var emitter = new TSCore.Events.EventEmitter();
        var counter = 0;

        var topicBCallback = () => {
            counter += 2;
        };

        var topicBContext = {
            context: 'topic B context'
        };


        var topicCCallback = () => {
            counter += 4;
        };

        var topicCContext = {
            context: 'topic C context'
        };

        emitter.on(topicA, () => {
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