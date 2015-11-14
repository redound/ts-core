module TSCore.Events {

    export class Event<T> extends TSCore.BaseObject {

        public isStopped: boolean;

        /**
         * Constructor function.
         *
         * @param topic Topic name of event.
         * @param _params Params that will be passed along event.
         * @param caller Context that trigger the original event.
         */
        constructor(public topic: string, private _params: T, public caller: any) {

            super();
            this.isStopped = false;
        }

        /**
         * Magic getter for params.
         *
         * @returns {T}
         */
        public get params(): T {
            return this._params;
        }

        /**
         * Stop the event from being called.
         *
         * @returns {void}
         */
        stop(): void {
            this.isStopped = true;
        }
    }
}