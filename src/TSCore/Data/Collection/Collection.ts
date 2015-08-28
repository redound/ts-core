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

        /**
         * Prepend item to collection.
         *
         * @param item  Item to be inserted.
         */
        public prepend(item:T) {
            this.insert(item, 0);
        }

        /**
         * Prepend multiple items to collection.
         *
         * @param items Items to be inserted
         */
        public prependMany(items:T[]) {

            this._data = items.concat(this._data);

            this.trigger(CollectionEvents.ADD, { items: [items] });
            this.trigger(CollectionEvents.CHANGE);
        }

        /**
         * Insert an item at a certain index.
         *
         * @param item  Item to be inserted.
         * @param index Index to insert item at.
         */
        public insert(item:T, index:number){

            this._data.splice(index, 0, item);

            this.trigger(CollectionEvents.ADD, { items: [item] });
            this.trigger(CollectionEvents.CHANGE);
        }

        /**
         * Replace one item with another item.
         *
         * @param source        The item that gets replaced inside the collection.
         * @param replacement   The item that replaces the source item.
         * @returns {T}
         */
        public replaceItem(source:T, replacement:T): T {
            return this.replace(this.indexOf(source), replacement);
        }

        /**
         * Replace one item at a certain index.
         *
         * @param index         Index of the item that gets replaced.
         * @param replacement   The item the replaces the source item.
         * @returns {any}
         */
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

        /**
         * Get the first item from collection.
         *
         * @returns {T}
         */
        public first(): T {
            return _.first(this._data);
        }

        /**
         * Get the last item from collection.
         * @returns {T}
         */
        public last(): T {
            return _.last(this._data);
        }

        /**
         * Get an item at a specified index in collection.
         *
         * @param index Index of the item to be returned.
         * @returns {T}
         */
        public get(index:number): T {
            return this._data[index];
        }

        /**
         * Get the index of an item in collection.
         *
         * @param item Item to return index for.
         * @returns {number}
         */
        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
        }
    }
}