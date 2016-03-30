import BaseObject from "../BaseObject";
import Dictionary from "../Data/Dictionary";

export interface StreamInterface extends BaseObject {
    exec(options:LogOptionsInterface);
}

export enum LOG_LEVELS {
    LOG,
    INFO,
    WARN,
    ERROR,
    FATAL
}

export interface LogOptionsInterface {
    level:LOG_LEVELS;
    tag:string;
    args:any[];
    time:number;
}

export interface StreamEntryInterface {
    level:LOG_LEVELS;
    stream:StreamInterface;
}

export default class Logger extends BaseObject {

    protected _streams:Dictionary<string, StreamEntryInterface>;
    protected _parent:Logger;
    protected _tag:string;

    constructor(parent?:Logger, tag?:string) {

        super();

        this._parent = parent;
        this._tag = tag;

        this._streams = this._parent ? this._parent.getStreams() : new Dictionary<string, StreamEntryInterface>();
    }

    /**
     * Return a child logger with a pre-configured tag
     *
     * @param tag
     */
    public child(tag:string):Logger {

        return new Logger(this, tag);
    }

    /**
     * Set ILogStream instance for key.
     *
     * @param key       Name for logger.
     * @param stream    StreamInterface instance.
     * @param level     Minimal log level for this stream
     */
    public addStream(key:string, stream:StreamInterface, level:LOG_LEVELS = LOG_LEVELS.LOG) {

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
    public removeStream(key:string) {

        this._streams.remove(key);
    }

    /**
     * Get all streams
     */
    public getStreams():Dictionary<string, StreamEntryInterface> {

        return this._streams;
    }

    /**
     * Execute log streams with LOG_LEVELS.LOG
     *
     * @returns {void}
     */
    public log(...args) {
        this._exec(LOG_LEVELS.LOG, args);
    }

    /**
     * Execute log streams with LOG_LEVELS.INFO
     *
     * @returns {void}
     */
    public info(...args) {
        this._exec(LOG_LEVELS.INFO, args);
    }

    /**
     * Execute log streams with LOG_LEVELS.WARN
     *
     * @returns {void}
     */
    public warn(...args) {
        this._exec(LOG_LEVELS.WARN, args);
    }

    /**
     * Execute log streams with LOG_LEVELS.INFO
     *
     * @returns {void}
     */
    public error(...args) {
        this._exec(LOG_LEVELS.ERROR, args);
    }

    /**
     * Execute log streams with LOG_LEVELS.FATAL
     *
     * @returns {void}
     */
    public fatal(...args) {
        this._exec(LOG_LEVELS.FATAL, args);
    }


    private _exec(level:LOG_LEVELS, args:any[]) {

        var tag = this._tag || args.shift();

        this._streams.each((key:string, streamEntry:StreamEntryInterface) => {

            if (level >= streamEntry.level) {

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
