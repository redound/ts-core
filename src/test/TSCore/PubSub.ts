/// <reference path="../tscore.ts" />

declare var describe, it, expect;

describe("TSCore.PubSub", () => {

    var topicA = 'topicA'
    var topicB = 'topic';
    var pubsub = new TSCore.PubSub();

    it("calls the callbackFn each time publish is called with same topic", () => {

        var counter = 0;
        pubsub.subscribe(topicB, () => {

            counter++;
        });

        expect(counter).toBe(0);

        pubsub.publish(topicB, []);
        expect(counter).toBe(1);

        pubsub.publish(topicB, []);
        expect(counter).toBe(2);

        pubsub.publish(topicB, []);
        expect(counter).toBe(3);

        pubsub.publish(topicB, []);
        expect(counter).toBe(4);
    });


    it("will not call callbackFn after returned function from subscribe is called (unsubscribe)", () => {

        var counter = 0;
        var unsubscribe = pubsub.subscribe(topicA, () => {

            var topic = topicA;

            counter++;
        });

        expect(counter).toBe(0);

        pubsub.publish(topicA, []);
        expect(counter).toBe(1);
        unsubscribe();

        pubsub.publish(topicA, []);
        expect(counter).toBe(1);

        pubsub.publish(topicA, []);
        expect(counter).toBe(1);
    });

});