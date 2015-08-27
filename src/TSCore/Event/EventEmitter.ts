/// <reference path="../TSCore.ts" />

module TSCore.Events {

    interface IEventEmitterCallbackItem {
        callback:Function,
        context?
    }

    export class EventEmitter {

        private _eventCallbacks: {};

        constructor() {
            this._eventCallbacks = {};
        }

        /**
         * Subscribe to triggered events.
         * @param events        Which events to listen, seperated by space
         * @param callback      Callback function to execute on trigger.
         * @param context       Context for the callback
         */
        public on(events:string, callback:Function, context?) {

            _.each(events.split(' '), (event:string) => {

                // Get or create event collection
                var callbackArray:IEventEmitterCallbackItem[] = this._eventCallbacks[event];

                if (!callbackArray) {

                    callbackArray = [];
                    this._eventCallbacks[event] = callbackArray;
                }

                // Push callback
                callbackArray.push({
                    callback: callback,
                    context: context
                });
            });
        }

        /**
         * Unsubscribe from published events.
         * @param events        Which events to stop listening, seperated by space
         * @param callback      Callback function executed on trigger.
         * @param context       Context for the callback
         */
        public off(events:string, callback?:Function, context?) {

            _.each(events.split(' '), (event:string) => {

                var callbackArray = this._eventCallbacks[event];

                if (!callbackArray) {
                    return;
                }

                if (!callback) {

                    delete this._eventCallbacks[event];
                    return;
                }

                var callbacksToRemove = _.where(callbackArray, context ? {callback: callback, context: context} : {callback: callback});
                callbackArray = _.difference(callbackArray, callbacksToRemove);

                if (callbackArray.length == 0) {
                    delete this._eventCallbacks[event];
                }
                else {
                    this._eventCallbacks[event] = callbackArray;
                }
            });
        }

        /**
         * Publish event for a topic.
         * @param event         Which event to trigger.
         * @param args          Arguments to pass along event.
         * @returns             void
         */
        public trigger(event:string, ...args) {

            var callbackArray = this._eventCallbacks[event];

            if (!callbackArray) {
                return;
            }

            _.each(callbackArray, (item:IEventEmitterCallbackItem) => {

                item.callback.apply(item.context || this, args || []);
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