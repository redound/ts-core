/// <reference path="../TSCore.ts" />

module TSCore.Geometry {

    export class Size {

        public width:number;
        public height:number;

        constructor(width:number=0, height:number=0) {

            this.width = width;
            this.height = height;
        }

        public halfWidth():number {
            return this.width / 2;
        }

        public halfHeight():number {
            return this.height / 2;
        }
    }
}