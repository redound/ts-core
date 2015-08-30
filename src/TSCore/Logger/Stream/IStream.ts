module TSCore.Logger {

    export interface IStream {
        level: LogLevel;
        exec(options: ILogOptions);
    }
}