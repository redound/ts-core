/// <reference path="../tscore.ts" />

declare var describe, it, expect;

describe("TSCore.Events.EventEmitter", () => {

    var topicA = 'topicA';
    var topicB = 'topic';
    var emitter = new TSCore.Events.EventEmitter();

    it("calls the callbackFn each time publish is called with same topic", () => {

        var counter = 0;
        emitter.on(topicB, () => {

            counter++;
        });

        expect(counter).toBe(0);

        emitter.trigger(topicB, []);
        expect(counter).toBe(1);

        emitter.trigger(topicB, []);
        expect(counter).toBe(2);

        emitter.trigger(topicB, []);
        expect(counter).toBe(3);

        emitter.trigger(topicB, []);
        expect(counter).toBe(4);
    });


    it("will not call callbackFn after returned function from subscribe is called (unsubscribe)", () => {

        var counter = 0;
         emitter.on(topicA, () => {

            var topic = topicA;
            counter++;
        });

        expect(counter).toBe(0);

        emitter.trigger(topicA, []);
        expect(counter).toBe(1);
        emitter.off(topicA);

        emitter.trigger(topicA, []);
        expect(counter).toBe(1);

        emitter.trigger(topicA, []);
        expect(counter).toBe(1);
    });

});