/// <reference path="../Events/EventEmitter.ts" />

module TSCore.Data {

    export module SetEvents {

        export const ADD: string = "add";
        export const CHANGE: string = "change";
        export const REMOVE: string = "remove";
        export const REPLACE: string = "replace";
        export const CLEAR: string = "clear";

        export interface IChangeParams<T> {}
        export interface IClearParams<T> {}

        export interface IAddParams<T> {
            items: T[]
        }

        export interface IRemoveParams<T> {
            items: T[]
        }

        export interface IReplaceParams<T> {
            source: T,
            replacement: T
        }
    }

    export class Set<T> extends TSCore.Events.EventEmitter {

        protected _data:T[];

        constructor(data?:T[]){

            super();
            this._data = data || [];
        }

        /**
         * Get length of set. (same as method count)
         *
         * @returns {number}
         */
        public get length():number {
            return this.count();
        }

        /**
         * Get count of set. (same as property length)
         *
         * @returns {number}
         */
        public count(): number {
            return this._data.length;
        }

        /**
         * Add (push) item to set.
         *
         * @param item Item to be added.
         */
        public add(item:T) {

            this._data.push(item);

            this.trigger(SetEvents.ADD, { items: [item] });
            this.trigger(SetEvents.CHANGE);
        }

        /**
         * Add multiple (concat) items to set.
         *
         * @param items Items to be added.
         */
        public addMany(items:T[] = []) {

            this._data = this._data.concat(items);

            this.trigger(SetEvents.ADD, { items: items });
            this.trigger(SetEvents.CHANGE);
        }

        /**
         * Remove item from set.
         *
         * @param item Item to be removed.
         */
        public remove(item: T) {

            this._data = _.without(this._data, item);

            this.trigger(SetEvents.REMOVE, { items: [item] });
            this.trigger(SetEvents.CHANGE);
        }

        /**
         * Remove multiple items from set.
         *
         * @param items Items to be removed.
         */
        public removeMany(items: T[]) {

            this._data = _.difference(this._data, items);

            this.trigger(SetEvents.REMOVE, { items: items });
            this.trigger(SetEvents.CHANGE);
        }

        /**
         * Remove items using properties.
         *
         * @param properties    Object containing key-value pairs.
         */
        public removeWhere(properties: {}) {
            this.removeMany(this.where(properties));
        }

        /**
         * Replace an item with another item in set
         *
         * TODO: Discussion - Should there be a recursiveReplaceItem() that will replace duplicates?
         *
         * @param source    The item that gets replaced inside the set.
         * @param replacement The item that replaces the source item.
         * @returns {any}
         */
        public replaceItem(source: T, replacement: T): T {

            var index = _.indexOf(this._data, source);

            if (index < 0 || index >= this.count()) {
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            this.trigger(SetEvents.REPLACE, { source: source, replacement: replacement });
            this.trigger(SetEvents.CHANGE);

            return currentItem;
        }

        /**
         * Clears the set.
         */
        public clear() {

            this._data = [];

            this.trigger(SetEvents.REMOVE, { items: this.toArray() });
            this.trigger(SetEvents.CLEAR);
            this.trigger(SetEvents.CHANGE);
        }

        /**
         * Iterates over all item in set, yielding each in turn to an iteratee function.
         *
         * @param iterator Iteratee function.
         */
        public each(iterator:_.ListIterator<T, void>){
            _.each(this._data, iterator);
        }

        /**
         * A convenient version of what is perhaps the most common use-case for map:
         * extracting a list of property values.
         *
         * @param propertyName Property name to pluck.
         * @returns {any[]}
         */
        public pluck(propertyName:string) : any[] {
            return _.pluck(this._data, propertyName);
        }

        /**
         * Check whether the set is empty.
         *
         * @returns {boolean}
         */
        public isEmpty(): boolean {
            return this.count() === 0;
        }

        /**
         * Find items using an optional iterator.
         *
         * @param iterator Iterator to use.
         * @returns {T[]}
         */
        public find(iterator?:_.ListIterator<T, boolean>): T[] {
            return _.filter(this._data, iterator);
        }

        /**
         * Find first item using an iterator.
         *
         * @param iterator
         * @returns {T}
         */
        public findFirst(iterator?:_.ListIterator<T, boolean>): T {
            return _.find(this._data, iterator);
        }

        /**
         * Looks through each value in the list, returning an array of all the values that contain all
         * of the key-value pairs listed in properties.
         *
         * ````js
         * collection.where({author: "Shakespeare", year: 1611});
         *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
         *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
         * ````
         * @param properties Object containing key-value pairs.
         * @returns {T[]}
         */
        public where(properties:{}): T[] {
            return _.where(this._data, properties);
        }

        /**
         * Looks through the list and returns the first value that matches all of the key-value pairs
         * listed in properties.
         *
         * @param properties Object containing key-value pairs.
         * @returns {T}
         */
        public whereFirst(properties:{}): T {
            return _.findWhere(this._data, properties);
        }

        /**
         * Check if set contains item.
         *
         * @param item Item to check against.
         * @returns {boolean}
         */
        public contains(item:T): boolean {
            return _.contains(this._data, item);
        }

        /**
         * Convert set to array.
         *
         * @returns {any[]}
         */
        public toArray():T[] {
            return _.clone(this._data);
        }
    }
}