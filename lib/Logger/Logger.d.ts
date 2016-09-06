import BaseObject from "../BaseObject";
import Dictionary from "../Data/Dictionary";
export interface StreamInterface extends BaseObject {
    exec(options: LogOptionsInterface): any;
}
export declare enum LOG_LEVELS {
    LOG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
}
export interface LogOptionsInterface {
    level: LOG_LEVELS;
    tag: string;
    args: any[];
    time: number;
}
export interface StreamEntryInterface {
    level: LOG_LEVELS;
    stream: StreamInterface;
}
export default class Logger extends BaseObject {
    protected _streams: Dictionary<string, StreamEntryInterface>;
    protected _parent: Logger;
    protected _tag: string;
    constructor(parent?: Logger, tag?: string);
    child(tag: string): Logger;
    addStream(key: string, stream: StreamInterface, level?: LOG_LEVELS): void;
    removeStream(key: string): void;
    getStreams(): Dictionary<string, StreamEntryInterface>;
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    fatal(...args: any[]): void;
    private _exec(level, args);
}
