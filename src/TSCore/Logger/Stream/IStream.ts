module TSCore.Logger {

    export interface IStream extends TSCore.BaseObject {
        exec(options: ILogOptions);
    }
}