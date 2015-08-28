module TSCore.Events {

    export class Event<T> {

        public isStopped: boolean;

        constructor(public topic: string, private _params: T, public caller: any) {

            this.isStopped = false;
        }

        public get params(): T {
            return this._params;
        }

        stop() {
            this.isStopped = true;
        }
    }
}