/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
import Dictionary from "../Data/Dictionary";
export interface StreamInterface extends BaseObject {
    exec(options: LogOptionsInterface): any;
}
export declare enum LogLevels {
    LOG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
}
export interface LogOptionsInterface {
    level: LogLevels;
    tag: string;
    args: any[];
    time: number;
}
export interface StreamEntryInterface {
    level: LogLevels;
    stream: StreamInterface;
}
export default class Logger extends BaseObject {
    protected _streams: Dictionary<string, StreamEntryInterface>;
    protected _parent: Logger;
    protected _tag: string;
    constructor(parent?: Logger, tag?: string);
    /**
     * Return a child logger with a pre-configured tag
     *
     * @param tag
     */
    child(tag: string): Logger;
    /**
     * Set ILogStream instance for key.
     *
     * @param key       Name for logger.
     * @param stream    StreamInterface instance.
     * @param level     Minimal log level for this stream
     */
    addStream(key: string, stream: StreamInterface, level?: LogLevels): void;
    /**
     * Unset ILogStream instance for key.
     *
     * @param key   Name for logger.
     */
    removeStream(key: string): void;
    /**
     * Get all streams
     */
    getStreams(): Dictionary<string, StreamEntryInterface>;
    /**
     * Execute log streams with LogLevels.LOG
     *
     * @returns {void}
     */
    log(...args: any[]): void;
    /**
     * Execute log streams with LogLevels.INFO
     *
     * @returns {void}
     */
    info(...args: any[]): void;
    /**
     * Execute log streams with LogLevels.WARN
     *
     * @returns {void}
     */
    warn(...args: any[]): void;
    /**
     * Execute log streams with LogLevels.INFO
     *
     * @returns {void}
     */
    error(...args: any[]): void;
    /**
     * Execute log streams with LogLevels.FATAL
     *
     * @returns {void}
     */
    fatal(...args: any[]): void;
    private _exec(level, args);
}
