import BaseObject from "../BaseObject";

export default class Exception extends BaseObject {

    public message:string;
    public code:number;
    public data:{};

    public get name():string {
        return typeof this;
    }

    constructor(message:string, code:number = 0, data:{} = null) {

        super();

        this.message = message;
        this.code = code;
        this.data = data;
    }

    public toString():string {
        return this.name + ' (' + this.code + '): ' + this.message;
    }
}
