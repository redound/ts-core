/// <reference path="../TSCore.ts" />

module TSCore.Geometry {

    export class Point {

        public x:number;
        public y:number;

        constructor(x:number=0, y:number=0) {

            this.x = x;
            this.y = y;
        }

        public translate(x:number, y:number){

            this.x += x;
            this.y += y;
        }
    }
}