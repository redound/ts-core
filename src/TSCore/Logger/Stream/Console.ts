/// <reference path="IStream.ts" />

module TSCore.Logger.Stream {

    export interface IConsole {
        debug();
        log();
        info();
        warn();
        error();
    }

    export class Console implements TSCore.Logger.IStream {

        public level: TSCore.Logger.LogLevel;

        constructor(private _console: IConsole) {

            this.level = TSCore.Logger.LogLevel.DEBUG;
        }

        public exec(options: TSCore.Logger.IExecOptions) {

            var method;

            if (this.level > options.level) {
                return;
            }

            switch(options.level) {

                case TSCore.Logger.LogLevel.DEBUG:
                    method = 'debug';
                    break;
                case TSCore.Logger.LogLevel.INFO:
                    method = 'info';
                    break;
                case TSCore.Logger.LogLevel.WARN:
                    method = 'warn';
                    break;
                case TSCore.Logger.LogLevel.ERROR:
                    method = 'error';
                    break;
            }

            this._console[method].apply(this._console, options.args || []);
        }
    }
}