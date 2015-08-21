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


        public center(): Point {
            return new Point(this.origin.x + this.size.halfWidth(), this.origin.y + this.size.halfHeight());
        }

        public topLeft(): Point {
            return new Point(this.origin.x, this.origin.y);
        }

        public bottomLeft(): Point {
            return new Point(this.origin.x, this.origin.y + this.size.height);
        }

        public topRight(): Point {
            return new Point(this.origin.x + this.size.width, this.origin.y);
        }

        public bottomRight(): Point {
            return new Point(this.origin.x + this.size.width, this.origin.y + this.size.height);
        }

        public halfWidth(): number {
            return this.size.halfWidth()
        }

        public halfHeight(): number {
            return this.size.halfHeight()
        }


        public containsPoint(point:Point): boolean {

            var topLeft = this.topLeft();
            var bottomRight = this.bottomRight();

            return point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y;
        }

        public containsRect(rect:Rect): boolean {

            return this.containsPoint(rect.topLeft()) && this.containsPoint(rect.bottomRight());
        }

        public intersectsRect(rect:Rect): boolean {

            return this.containsPoint(rect.topLeft()) || this.containsPoint(rect.bottomLeft()) || this.containsPoint(rect.topRight()) || this.containsPoint(rect.bottomRight());
        }

        public inset(top:number, right:number, bottom:number, left:number){

            this.origin.x += left;
            this.origin.y += top;
            this.size.width -= right;
            this.size.height -= bottom;
        }

        public insetCenter(horizontal:number, vertical:number){
            this.inset(vertical/2, horizontal/2, vertical/2, horizontal/2);
        }

        public expand(horizontal:number, vertical:number){
            this.insetCenter(-horizontal, -vertical);
        }

        public reduce(horizontal:number, vertical:number){
            this.insetCenter(horizontal, vertical);
        }
    }
}