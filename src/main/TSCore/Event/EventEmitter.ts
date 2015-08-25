/// <reference path="../../tscore.d.ts" />
/// <reference path="../Data/Collection/Dictionary.ts" />
/// <reference path="../Data/Collection/Set.ts" />

module TSCore.Events {

    import Set = TSCore.Data.Collection.Set;
    import Dictionary = TSCore.Data.Collection.Dictionary;

    interface IEventEmitterCallbackItem {
        callback:Function,
        context?
    }

    export class EventEmitter {

        private _eventCallbacks: Dictionary<string, Set<IEventEmitterCallbackItem>>;

        constructor() {
            this._eventCallbacks = new Dictionary<string, Set<IEventEmitterCallbackItem>>();
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
                var callbackSet = this._eventCallbacks.get(event);

                if (!callbackSet) {

                    callbackSet = new Set<IEventEmitterCallbackItem>();
                    this._eventCallbacks.set(event, callbackSet);
                }

                // Push callback
                callbackSet.add({
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

                if (!this._eventCallbacks.contains(event)) {
                    return;
                }

                if (!callback) {

                    this._eventCallbacks.remove(event);
                    return;
                }

                var callbackSet = this._eventCallbacks.get(event);
                callbackSet.removeWhere(context ? {callback: callback, context: context} : {callback: callback});

                if (callbackSet.length == 0) {
                    this._eventCallbacks.remove(event);
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

            if (!this._eventCallbacks.contains(event)) {
                return;
            }

            this._eventCallbacks.get(event).each((item:IEventEmitterCallbackItem) => {

                item.callback.apply(item.context || this, args || []);
            });
        }

        /**
         * Reset all subscriptions.
         */
        public resetEvents() {
            this._eventCallbacks.clear();
        }
    }
}