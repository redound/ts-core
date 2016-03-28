import { LogOptionsInterface, StreamInterface } from "../Logger";
import BaseObject from "../../BaseObject";
export interface ConsoleInterface {
    log(): any;
    info(): any;
    warn(): any;
    error(): any;
}
export default class ConsoleStream extends BaseObject implements StreamInterface {
    private _console;
    colorsEnabled: boolean;
    constructor(_console: ConsoleInterface, colorsEnabled?: boolean);
    exec(options: LogOptionsInterface): void;
    protected _generateHex(input: string): string;
    protected _getIdealTextColor(bgColor: any): string;
}
