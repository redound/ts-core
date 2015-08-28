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

        /**
         * Magic getter for sortPredicate.
         *
         * @returns {any}
         */
        public get sortPredicate() {
            return this._sortPredicate;
        }

        /** Magic setter for sortPredicate
         *
         * @param predicate Predicate to set.
         */
        public set sortPredicate(predicate) {
            this._sortPredicate = predicate;
            this.sort();
        }

        /**
         * Constructor function
         * @param data Data to populate collection of instance with.
         * @param sortPredicate Predicate to sort collection to.
         */
        constructor(data:T[], sortPredicate) {

            super(data);

            this._sortPredicate = sortPredicate;
            this.sort();
        }

        /**
         * Add item to collection.
         *
         * @param item Item to be added.
         * @return {void}
         */
        public add(item:T): void {

            super.add(item);
            this.sort();
        }

        /**
         * Add multiple items to collection.
         *
         * @param items Items to be added.
         * @return {void}
         */
        public addMany(items:T[]): void {

            super.addMany(items);
            this.sort();
        }

        /**
         * Remove item from collection.
         *
         * @param item Item to be removed.
         * @return {void}
         */
        public remove(item:T): void {

            super.remove(item);
            this.sort();
        }

        /**
         * Remove multiple items from collection.
         *
         * @param items Items to be removed.
         */
        public removeMany(items:T[]) {

            super.removeMany(items);
            this.sort();
        }

        /**
         * Replace an item for another item.
         *
         * @param source Item to be replaced in collection.
         * @param replacement Item that replaces source item in collection.
         * @returns {T}
         */
        public replaceItem(source:T, replacement:T): T {

            var currentItem = super.replaceItem(source, replacement);
            this.sort();

            return currentItem;
        }

        /**
         * Get first item in collection.
         *
         * @returns {T}
         */
        public first(): T {
            return _.first(this._data);
        }

        /**
         * Get last item in collection.
         *
         * @returns {T}
         */
        public last(): T {
            return _.last(this._data);
        }

        /**
         * Get item at index.
         *
         * @param index Index to get item for.
         * @returns {T}
         */
        public get(index:number): T {
            return this._data[index];
        }

        /**
         * Get index of item.
         *
         * @param item Item to get index for.
         * @returns {number}
         */
        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
        }

        /**
         * Sort collection.
         *
         * @returns {void}
         */
        public sort(): void {

            if(this._sortPredicate === null || this._sortPredicate === undefined) {
                return;
            }

            this._data = _.sortBy(this._data, this._sortPredicate);

            this.trigger(SortedCollectionEvents.SORT);
            this.trigger(SortedCollectionEvents.CHANGE);
        }
    }
}