/// <reference path="../tscore.d.ts" />

module TSCore {

    /** TODO
     * 1. Make use of types
     * 2. Event/Topic bag
     * 3. Use arguments instead of args passed as array
     * 4. Write test
     */

    /**
     * @example
     *
     * var pubsub = new TSCore.Event.PubSub();
     *
     * var unsubscribe = pubsub.subscribe('loaded', function(arg1, arg2) {
     *
     *     console.debug(arg1); // 'test123'
     * });
     *
     * pubsub.publish('loaded', ['test123', 'test456']);
     *
     * // Unsubscribe from `loaded` event
     * unsubscribe();
     */

    export class PubSub {

        private _cache:{};

        constructor() {

            this._cache = {};
        }

        /**
         * Subscribe to published events.
         * @param topic         Topic for which event to listen.
         * @param callback      Callback function to execute on event.
         * @returns             Function to remove the handler (unsubscribe).
         */
        public subscribe(topic:string, callback) {

            // Create array for topic to store callbacks
            this._cache[topic] = this._cache[topic] || [];

            // Push callback
            this._cache[topic].push(callback);

            // Provide function to unsubscribe the callback
            return () => {

                if (!this._cache[topic]) {
                    return;
                }

                for (var index in this._cache[topic]) {

                    var fn = this._cache[topic][index];

                    if (fn === callback) {
                        this._cache[topic] = this._cache[topic].splice(0, index);
                    }
                }
            };
        }

        /**
         * Publish event for a topic.
         * @param topic         Topic for which event to publish.
         * @param args          Arguments to pass along event.
         * @returns             void
         */
        public publish(topic, args):void {

            if (!this._cache[topic]) {
                return;
            }

            _.each(this._cache[topic], (callback:any) => {

                callback.apply(this, args || []);
            });
        }

        /**
         * Reset all subscriptions.
         * @returns             void
         */
        public reset() {

            this._cache = [];
        }
    }
}