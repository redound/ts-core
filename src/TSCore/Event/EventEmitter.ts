/// <reference path="Event.ts" />

module TSCore.Events {

    interface IEventEmitterCallbackItem {
        topic: string,
        callback: IEventEmitterCallback,
        context?: any,
        once: boolean,
    }

    export interface IEventEmitterCallback {
        (event: Event<any>);
    }

    export class EventEmitter {

        private _eventCallbacks: {};

        constructor() {
            this._eventCallbacks = {};
        }

        /**
         * Subscribe to triggered events.
         * @param topics        Which topics to listen, separated by space
         * @param callback      Callback function to execute on trigger.
         * @param context       Context for the callback
         * @param once          Run the callback for emitted event exactly one
         */
        public on(topics: string, callback: IEventEmitterCallback, context?, once: boolean = false) {

            _.each(topics.split(' '), (topic:string) => {

                // Get or create event collection
                var callbackArray:IEventEmitterCallbackItem[] = this._eventCallbacks[topic];

                if (!callbackArray) {

                    callbackArray = [];
                    this._eventCallbacks[topic] = callbackArray;
                }

                // Push callback
                callbackArray.push({
                    topic: topic,
                    callback: callback,
                    context: context,
                    once: once
                });
            });
        }

        /**
         * Subscribe to emitted topics exactly once
         * @param topics        Which topics to listen, separated by space
         * @param callback      Callback function to execute on trigger.
         * @param context       Context for the callback
         */
        public once(topics: string, callback: IEventEmitterCallback, context?): void {

            return this.on.apply(this, [topics, callback, context, true]);
        }

        /**
         * Unsubscribe from published topics.
         * @param topics        Which topics to stop listening, seperated by space
         * @param callback      Callback function executed on trigger.
         * @param context       Context for the callback
         */
        public off(topics: string, callback?: Function, context?) {

            _.each(topics.split(' '), (topic:string) => {

                var callbackArray = this._eventCallbacks[topic];

                if (!callbackArray) {
                    return;
                }

                if (!callback) {

                    delete this._eventCallbacks[topic];
                    return;
                }

                var callbacksToRemove = _.where(callbackArray, context ? {callback: callback, context: context} : {callback: callback});
                callbackArray = _.difference(callbackArray, callbacksToRemove);

                if (callbackArray.length == 0) {
                    delete this._eventCallbacks[topic];
                }
                else {
                    this._eventCallbacks[topic] = callbackArray;
                }
            });
        }

        /**
         * Publish event for a topic.
         * ````
         * var emitter = new TSCore.Event.EventEmitter();
         * emitter.trigger('topic', arg1, arg2);
         * ````
         * @param topic         Which topic to trigger.
         * @param args          Arguments to pass along event.
         * @returns             void
         */
        public trigger(topic: string, params?: {}, caller?: any) {

            var callbackArray = this._eventCallbacks[topic];

            if (!callbackArray) {
                return;
            }

            // create event
            var event = new Event(topic, params, caller);

            _.each(callbackArray, (item:IEventEmitterCallbackItem) => {

                if (event.isStopped) {
                    return;
                }

                item.callback.apply(item.context || this, [event]);

                if (item.once) {
                    this.off(topic, item.callback, item.context);
                }
            });
        }

        /**
         * Reset all subscriptions.
         */
        public resetEvents() {
            this._eventCallbacks = {};
        }
    }
}