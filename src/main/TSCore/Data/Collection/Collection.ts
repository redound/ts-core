/// <reference path="../../../tscore.d.ts" />
/// <reference path="./Set.ts" />

module TSCore.Data.Collection {

    export class Collection<T> extends Set<T> {

        public get length():number {
            return this.count();
        }

        protected _data:T[];


        public prepend(item:T){
            this.insert(item, 0);
        }

        public prependMany(items:T[]){
            this._data = items.concat(this._data);
        }

        public insert(item:T, index:number){
            this._data.splice(index, 0, item);
        }

        public replaceItem(source:T, replacement:T): T {
            return this.replace(this.indexOf(source), replacement);
        }

        public replace(index:number, replacement:T): T {

            if(index < 0 || index >= this.count()){
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            return currentItem;
        }

        public first(): T {
            return _.first(this._data);
        }

        public last(): T {
            return _.last(this._data);
        }

        public get(index:number): T {
            return this._data[index];
        }

        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
        }
    }
}