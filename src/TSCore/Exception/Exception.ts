/// <reference path="../../tscore.d.ts" />

module TSCore.Exception {

    export class Exception {

        public message:string;
        public code:number;
        public data:{};

        public get name(): string{
            return typeof this;
        }

        constructor(message:string, code:number=0, data:{}=null){

            this.message = message;
            this.code = code;
            this.data = data;
        }

        public toString(): string {
            return this.name + ' (' + this.code + '): ' + this.message;
        }
    }
}