/// <reference path="../../tscore.d.ts" />

module TSCore.Geometry {

    export class Rect {

        public origin:Point;
        public size:Size;

        public get x(){
            return this.origin.x;
        }
        public set x(x:number){
            this.origin.x = x;
        }

        public get y(){
            return this.origin.y;
        }
        public set y(y:number){
            this.origin.y = y;
        }

        public get width(){
            return this.size.width;
        }
        public set width(width:number){
            this.size.width = width;
        }

        public get height(){
            return this.size.height;
        }
        public set height(height:number){
            this.size.height = height;
        }

        constructor(x:number=0, y:number=0, width:number=0, height:number=0) {

            this.origin = new Point(x, y);
            this.size = new Size(width, height);
        }
    }
}