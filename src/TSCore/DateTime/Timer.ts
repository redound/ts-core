module TSCore.DateTime {

    export interface ITimerTickCallback {
        (tickCount: number, elapsedTime:number):void;
    }

    export class Timer {

        public timeout:number;
        public tickCallback:ITimerTickCallback;
        public repeats:boolean;

        public get tickCount():number { return this._tickCount }
        public get elapsedTime(): number {

            if(!this._startDate){
                return null;
            }

            return new Date().getTime() - this._startDate.getTime();
        }

        public get startDate():Date { return this._startDate }
        public get isStarted():boolean { return this._isStarted }


        private _isStarted:boolean;
        private _tickCount:number;
        private _startDate:Date;

        private _internalTimer:number;
        private _internalTimerIsInterval:boolean;

        /**
         * Constructor function
         *
         * @param timeout Time (in milliseconds) for the timer to execute.
         * @param tickCallback Callback to call when timer gets executed.
         * @param repeats Whether the timer should repeat.
         */
        constructor(timeout:number, tickCallback:ITimerTickCallback=null, repeats:boolean=false){

            this.timeout = timeout;
            this.tickCallback = tickCallback;
            this.repeats = repeats;
        }

        /**
         * Start timer if not already started.
         *
         * @returns {void}
         */
        public start(): void {

            if(this._isStarted){
                return;
            }

            this._tickCount = 0;
            this._startDate = new Date();

            this.resume();
        }

        /**
         * Resume timer if not running.
         *
         * @returns {void}
         */
        public resume(): void {

            if(this._isStarted){
                return;
            }

            this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
            this._internalTimerIsInterval = this.repeats;

            this._isStarted = true;
        }

        /**
         * Pause timer if it's running.
         *
         * @returns {void}
         */
        public pause(): void {

            if(!this._isStarted){
                return;
            }

            (this._internalTimerIsInterval ? clearInterval : clearTimeout)(this._internalTimer);
            this._internalTimer = null;

            this._isStarted = false;
        }

        /**
         * Restart the timer.
         *
         * @returns {void}
         */
        public restart(){

            this.stop();
            this.start();
        }

        /**
         * Stop the timer.
         *
         * @returns {void}
         */
        public stop(){

            this.reset();
        }

        /**
         * Reset the timer. The timer will pause.
         *
         * @returns {void}
         */
        public reset(){

            if(this._isStarted){
                this.pause();
            }

            this._tickCount = 0;
            this._startDate = null;
        }

        /**
         * Start the timer.
         *
         * @param timeout Time (in milliseconds) for the timer to execute.
         * @param tickCallback Callback to call when timer gets executed.
         * @param repeats   Whether the timer should repeat.
         * @returns {TSCore.DateTime.Timer}
         */
        public static start(timeout:number, tickCallback:ITimerTickCallback=null, repeats:boolean=false) : Timer {

            var timer = new Timer(timeout, tickCallback, repeats);
            timer.start();

            return timer;
        }

        /**
         * Increases tick count.
         * Calls tick callback.
         *
         * @private
         */
        private _timerTick(){

            this._tickCount++;

            if(this.tickCallback){
                this.tickCallback(this._tickCount, this.elapsedTime);
            }
        }
    }
}