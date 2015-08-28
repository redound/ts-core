/// <reference path="./Set.ts" />

module TSCore.Data.Collection {

    export module CollectionEvents {

        export const ADD:string = SetEvents.ADD;
        export const CHANGE:string = SetEvents.CHANGE;
        export const REMOVE:string = SetEvents.REMOVE;
        export const REPLACE:string = SetEvents.REPLACE;
        export const CLEAR:string = SetEvents.CLEAR;

        export interface IChangeParams<T> extends SetEvents.IChangeParams<T> {}
        export interface IClearParams<T> extends SetEvents.IClearParams<T> {}
        export interface IAddParams<T> extends SetEvents.IAddParams<T> {}
        export interface IRemoveParams<T> extends SetEvents.IRemoveParams<T> {}
        export interface IReplaceParams<T> extends SetEvents.IReplaceParams<T> {}
    }

    export class Collection<T> extends Set<T> {

        public get length():number {
            return this.count();
        }

        protected _data:T[];


        public prepend(item:T) {
            this.insert(item, 0);
        }

        public prependMany(items:T[]) {

            this._data = items.concat(this._data);

            this.trigger(CollectionEvents.ADD, { items: [items] });
            this.trigger(CollectionEvents.CHANGE);
        }

        public insert(item:T, index:number){

            this._data.splice(index, 0, item);

            this.trigger(CollectionEvents.ADD, { items: [item] });
            this.trigger(CollectionEvents.CHANGE);
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

            this.trigger(CollectionEvents.REPLACE, { source: currentItem, replacement: replacement });
            this.trigger(CollectionEvents.CHANGE);

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