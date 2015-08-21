/// <reference path="../../tscore.d.ts" />

module TSCore.DateTime {

    export interface TimerTickCallback {
        (tickCount: number, elapsedTime:number):void;
    }

    export class Timer {

        public timeout:number;
        public tickCallback:TimerTickCallback;
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


        constructor(timeout:number, tickCallback:TimerTickCallback=null, repeats:boolean=false){

            this.timeout = timeout;
            this.tickCallback = tickCallback;
            this.repeats = repeats;
        }

        public start(){

            if(this._isStarted){
                return;
            }

            this._tickCount = 0;
            this._startDate = new Date();

            this.resume();
        }

        public resume(){

            if(this._isStarted){
                return;
            }

            this._internalTimer = this.repeats ? setInterval(_.bind(this._timerTick, this), this.timeout) : setTimeout(_.bind(this._timerTick, this), this.timeout);
            this._internalTimerIsInterval = this.repeats;

            this._isStarted = true;
        }

        public pause(){

            if(!this._isStarted){
                return;
            }

            this._internalTimerIsInterval ? clearInterval(this._internalTimer) : clearTimeout(this._internalTimer);
            this._internalTimer = null;

            this._isStarted = false;
        }

        public restart(){

            this.stop();
            this.start();
        }

        public stop(){

            this.reset();
        }

        public reset(){

            if(this._isStarted){
                this.pause();
            }

            this._tickCount = 0;
            this._startDate = null;
        }


        public static start(timeout:number, tickCallback:TimerTickCallback=null, repeats:boolean=false) : Timer {

            var timer = new Timer(timeout, tickCallback, repeats);
            timer.start();

            return timer;
        }


        private _timerTick(){

            this._tickCount++;

            if(this.tickCallback){
                this.tickCallback(this._tickCount, this.elapsedTime);
            }
        }
    }
}