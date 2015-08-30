/// <reference path="Stream/IStream.ts" />

module TSCore {

    export module Logger {

        export enum LogLevel {
            TRACE,
            DEBUG,
            INFO,
            WARN,
            ERROR,
            FATAL
        }

        export interface IExecOptions {
            level: LogLevel;
            args: any[];
        }

        export interface ILogOptions {
            level: LogLevel;
            args: any[];
            time: number;
        }

        export class Logger {

            private _streams:TSCore.Data.Dictionary<string, TSCore.Logger.IStream>;

            constructor() {

                this._streams = new TSCore.Data.Dictionary<string, TSCore.Logger.IStream>();
            }

            /**
             * Set ILogStream instance for key.
             *
             * @param key       Name for logger.
             * @param logger    TSCore.Logger.Adapters.IAdapter instance.
             */
            public setStream(key: string, logger: TSCore.Logger.IStream) {

                this._streams.set(key, logger);
            }

            /**
             * Unset ILogStream instance for key.
             *
             * @param key   Name for logger.
             */
            public unsetStream(key: string) {

                this._streams.remove(key);
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.TRACE
             *
             * @returns {void}
             */
            public trace(...args): void {
                this._exec({
                    level: TSCore.Logger.LogLevel.TRACE,
                    args: args
                });
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.DEBUG
             *
             * @returns {void}
             */
            public debug(...args) {
                this._exec({
                    level: TSCore.Logger.LogLevel.DEBUG,
                    args: args
                });
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.INFO
             *
             * @returns {void}
             */
            public info(...args) {
                this._exec({
                    level: TSCore.Logger.LogLevel.INFO,
                    args: args
                });
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.WARN
             *
             * @returns {void}
             */
            public warn(...args) {
                this._exec({
                    level: TSCore.Logger.LogLevel.WARN,
                    args: args
                });
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.INFO
             *
             * @returns {void}
             */
            public error(...args) {
                this._exec({
                    level: TSCore.Logger.LogLevel.ERROR,
                    args: args
                });
            }

            /**
             * Execute log streams with TSCore.Logger.LogLevel.FATAL
             *
             * @returns {void}
             */
            public fatal(...args) {
                this._exec({
                    level: TSCore.Logger.LogLevel.FATAL,
                    args: args
                });
            }

            private _exec(options: TSCore.Logger.IExecOptions) {

                this._streams.each((key:string, stream: TSCore.Logger.IStream) => {

                    stream.exec({
                        level: options.level,
                        args: options.args,
                        time: new Date().getTime()
                    });
                });
            }
        }
    }
}