module TSCore.Logger {

    export interface IStream {
        exec(options: ILogOptions);
    }
}