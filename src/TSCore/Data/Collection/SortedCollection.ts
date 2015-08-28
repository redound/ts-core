/// <reference path="./Set.ts" />

module TSCore.Data.Collection {

    export module SortedCollectionEvents {

        export const ADD:string = SetEvents.ADD;
        export const CHANGE:string = SetEvents.CHANGE;
        export const REMOVE:string = SetEvents.REMOVE;
        export const REPLACE:string = SetEvents.REPLACE;
        export const CLEAR:string = SetEvents.CLEAR;
        export const SORT:string = "sort";

        export interface IChangeParams<T> extends SetEvents.IChangeParams<T> {}
        export interface IClearParams<T> extends SetEvents.IClearParams<T> {}
        export interface IAddParams<T> extends SetEvents.IAddParams<T> {}
        export interface IRemoveParams<T> extends SetEvents.IRemoveParams<T> {}
        export interface IReplaceParams<T> extends SetEvents.IReplaceParams<T> {}
        export interface ISortParams<T> {}
    }

    export class SortedCollection<T> extends Set<T> {

        protected _sortPredicate;

        public get sortPredicate() {
            return this._sortPredicate;
        }

        public set sortPredicate(predicate) {
            this._sortPredicate = predicate;
            this.sort();
        }

        constructor(data:T[], sortPredicate) {

            super(data);

            this._sortPredicate = sortPredicate;
            this.sort();
        }

        public add(item:T) {

            super.add(item);
            this.sort();
        }

        public addMany(items:T[]) {

            super.addMany(items);
            this.sort();
        }

        public remove(item:T) {

            super.remove(item);
            this.sort();
        }

        public removeMany(items:T[]) {

            super.removeMany(items);
            this.sort();
        }

        public replaceItem(source:T, replacement:T): T {

            var currentItem = super.replaceItem(source, replacement);
            this.sort();

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

        public sort() {

            if(this._sortPredicate === null || this._sortPredicate === undefined) {
                return;
            }

            this._data = _.sortBy(this._data, this._sortPredicate);

            this.trigger(SortedCollectionEvents.SORT);
            this.trigger(SortedCollectionEvents.CHANGE);
        }
    }
}