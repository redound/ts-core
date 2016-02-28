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

    export class EventEmitter extends TSCore.BaseObject {

        private _eventCallbacks: {};

        /**
         * Constructor function
         *
         * @returns {TSCore.Events.EventEmitter}
         */
        constructor() {

            super();

            this._eventCallbacks = {};
        }

        /**
         * Subscribe to triggered events.
         * @param topics        Which topics to listen, separated by space
         * @param callback      Callback function to execute on trigger.
         * @param context       Context for the callback
         * @param once          Run the callback for emitted event exactly one
         * @returns             {TSCore.Events.EventEmitter}
         */
        public on(topics: string, callback: IEventEmitterCallback, context?, once: boolean = false): TSCore.Events.EventEmitter {

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

            return this;
        }

        /**
         * Subscribe to emitted topics exactly once
         * @param topics        Which topics to listen, separated by space
         * @param callback      Callback function to execute on trigger.
         * @param context       Context for the callback
         * @returns             {TSCore.Events.EventEmitter}
         */
        public once(topics: string, callback: IEventEmitterCallback, context?): TSCore.Events.EventEmitter {

            return this.on.apply(this, [topics, callback, context, true]);
        }

        /**
         * Unsubscribe from published topics.
         * @param topics        Which topics to stop listening, seperated by space
         * @param callback      Callback function executed on trigger.
         * @param context       Context for the callback
         * @returns             {TSCore.Events.EventEmitter}
         */
        public off(topics: string, callback?: Function, context?): TSCore.Events.EventEmitter {

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

            return this;
        }

        /**
         * Publish event for a topic.
         * TODO: Generic for param bag.
         * ````
         * var emitter = new TSCore.Event.EventEmitter();
         * emitter.trigger('topic', arg1, arg2);
         * ````
         * @param topic         Which topic to trigger.
         * @param args          Arguments to pass along event.
         * @returns             {TSCore.Events.EventEmitter}
         */
        public trigger<T>(topic: string, params?: T, caller?: any): TSCore.Events.EventEmitter {

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

            return this;
        }

        /**
         * Reset all subscriptions.
         *
         * @returns {TSCore.Events.EventEmitter}
         */
        public reset(): TSCore.Events.EventEmitter {
            this._eventCallbacks = {};

            return this;
        }
    }
}