/// <reference path="Stream/IStream.ts" />

module TSCore.Logger {

    export enum LogLevel {
        LOG,
        INFO,
        WARN,
        ERROR,
        FATAL
    }

    export interface ILogOptions {
        level: LogLevel;
        tag: string;
        args: any[];
        time: number;
    }

    export interface IStreamEntry {
        level: LogLevel;
        stream: TSCore.Logger.IStream;
    }

    export class Logger extends TSCore.BaseObject {

        protected _streams: TSCore.Data.Dictionary<string, IStreamEntry>;
        protected _parent: Logger;
        protected _tag: string;

        constructor(parent?: Logger, tag?: string) {

            super();

            this._parent = parent;
            this._tag = tag;

            this._streams = this._parent ? this._parent.getStreams() : new TSCore.Data.Dictionary<string, IStreamEntry>();
        }

        /**
         * Return a child logger with a pre-configured tag
         *
         * @param tag
         */
        public child(tag: string): Logger {

            return new Logger(this, tag);
        }

        /**
         * Set ILogStream instance for key.
         *
         * @param key       Name for logger.
         * @param stream    TSCore.Logger.IStream instance.
         * @param level     Minimal log level for this stream
         */
        public addStream(key: string, stream: TSCore.Logger.IStream, level: LogLevel = LogLevel.LOG) {

            this._streams.set(key, {
                level: level,
                stream: stream
            });
        }

        /**
         * Unset ILogStream instance for key.
         *
         * @param key   Name for logger.
         */
        public removeStream(key: string) {

            this._streams.remove(key);
        }

        /**
         * Get all streams
         */
        public getStreams(): TSCore.Data.Dictionary<string, IStreamEntry> {

            return this._streams;
        }

        /**
         * Execute log streams with TSCore.Logger.LogLevel.LOG
         *
         * @returns {void}
         */
        public log(...args) {
            this._exec(LogLevel.LOG, args);
        }

        /**
         * Execute log streams with TSCore.Logger.LogLevel.INFO
         *
         * @returns {void}
         */
        public info(...args) {
            this._exec(LogLevel.INFO, args);
        }

        /**
         * Execute log streams with TSCore.Logger.LogLevel.WARN
         *
         * @returns {void}
         */
        public warn(...args) {
            this._exec(LogLevel.WARN, args);
        }

        /**
         * Execute log streams with TSCore.Logger.LogLevel.INFO
         *
         * @returns {void}
         */
        public error(...args) {
            this._exec(LogLevel.ERROR, args);
        }

        /**
         * Execute log streams with TSCore.Logger.LogLevel.FATAL
         *
         * @returns {void}
         */
        public fatal(...args) {
            this._exec(LogLevel.FATAL, args);
        }


        private _exec(level: LogLevel, args: any[]) {

            var tag = this._tag || args.shift();

            this._streams.each((key:string, streamEntry: IStreamEntry) => {

                if(level >= streamEntry.level) {

                    streamEntry.stream.exec({
                        level: level,
                        tag: tag,
                        args: args,
                        time: new Date().getTime()
                    });
                }
            });
        }
    }
}