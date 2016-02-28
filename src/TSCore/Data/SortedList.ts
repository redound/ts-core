///<reference path="SortedListEvents.ts"/>


module TSCore.Data {

    import SortedListEvents = TSCore.Data.SortedListEvents;
    
    export class SortedList<T> extends TSCore.BaseObject {

        protected _sortPredicate;
        protected _data:T[];
        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();


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
         * @param data Data to populate list of instance with.
         * @param sortPredicate Predicate to sort list to.
         */
        constructor(data:T[], sortPredicate) {

            super();

            this._data = data || [];
            this._sortPredicate = sortPredicate;

            this.sort();
        }

        /**
         * Get length of List. (same as method count)
         *
         * @returns {number}
         */
        public get length():number {
            return this.count();
        }

        /**
         * Get count of List. (same as property length)
         *
         * @returns {number}
         */
        public count(): number {
            return this._data.length;
        }

        /**
         * Add (push) item to List.
         *
         * @param item Item to be added.
         */
        public add(item:T) {

            this._data.push(item);
            this.sort();

            var addedItems = [{ item: item, index: this.indexOf(item) }];

            this.events.trigger(SortedListEvents.ADD, { operations: addedItems });
            this.events.trigger(SortedListEvents.CHANGE);
        }

        /**
         * Add multiple (concat) items to List.
         *
         * @param items Items to be added.
         */
        public addMany(items:T[] = []) {

            this._data = this._data.concat(items);
            this.sort();

            var addedItems = [];

            _.each(items, item => {
                addedItems.push({
                    item: item,
                    index: this.indexOf(item)
                });
            });

            this.events.trigger(SortedListEvents.ADD, { operations: addedItems });
            this.events.trigger(SortedListEvents.CHANGE);
        }

        /**
         * Remove item from List.
         *
         * @param item Item to be removed.
         */
        public remove(item: T) {

            this._data = _.without(this._data, item);
            this.sort();

            var removedItems = [{
                item: item,
                index: this.indexOf(item)
            }];

            this.events.trigger(SortedListEvents.REMOVE, { operations: removedItems, clear: false });
            this.events.trigger(SortedListEvents.CHANGE);
        }

        /**
         * Remove multiple items from List.
         *
         * @param items Items to be removed.
         */
        public removeMany(items: T[]) {

            this._data = _.difference(this._data, items);
            this.sort();

            var removedItems = _.map(items, item => {
                return {
                    item: item,
                    index: this.indexOf(item)
                };
            });

            this.events.trigger(SortedListEvents.REMOVE, { operations: removedItems, clear: false });
            this.events.trigger(SortedListEvents.CHANGE);
        }

        /**
         * Remove items using properties.
         *
         * @param properties    Object containing key-value pairs.
         */
        public removeWhere(properties: any) {
            this.removeMany(this.where(properties));
        }

        /**
         * Replace an item with another item.
         *
         * @param source        The item that gets replaced inside the list.
         * @param replacement   The item that replaces the source item.
         * @returns {T}
         */
        public replaceItem(source:T, replacement:T): T {

            var index = _.indexOf(this._data, source);

            if (index < 0 || index >= this.count()) {
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            this.sort();

            this.events.trigger(SortedListEvents.REPLACE, { source: source, replacement: replacement });
            this.events.trigger(SortedListEvents.CHANGE);

            return currentItem;
        }

        /**
         * Clears the List.
         */
        public clear() {

            var removedItems = _.map(this._data, (item, index) => {
                return {
                    item: item,
                    index: index
                }
            });

            this._data = [];
            this.events.trigger<SortedListEvents.IRemoveParams<T>>(SortedListEvents.REMOVE, { operations: removedItems, clear: true });
            this.events.trigger(SortedListEvents.CLEAR);
            this.events.trigger(SortedListEvents.CHANGE);
        }

        /**
         * Iterates over all item in List, yielding each in turn to an iteratee function.
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
         * Check whether the List is empty.
         *
         * @returns {boolean}
         */
        public isEmpty(): boolean {
            return this.count() === 0;
        }

        /**
         * Get the first item from list.
         *
         * @returns {T}
         */
        public first(): T {
            return _.first(this._data);
        }

        /**
         * Get the last item from list.
         * @returns {T}
         */
        public last(): T {
            return _.last(this._data);
        }

        /**
         * Get an item at a specified index in list.
         *
         * @param index Index of the item to be returned.
         * @returns {T}
         */
        public get(index:number): T {
            return this._data[index];
        }

        /**
         * Get the index of an item in list.
         *
         * @param item Item to return index for.
         * @returns {number}
         */
        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
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
         * list.where({author: "Shakespeare", year: 1611});
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
         * Check if List contains item.
         *
         * @param item Item to check against.
         * @returns {boolean}
         */
        public contains(item:T): boolean {
            return _.contains(this._data, item);
        }

        /**
         * Convert List to array.
         *
         * @returns {any[]}
         */
        public toArray():T[] {
            return _.clone(this._data);
        }

        public clone(): SortedList<T> {
            return new SortedList<T>(_.clone(this._data), this._sortPredicate);
        }


        /**
         * Sort list.
         *
         * @returns {void}
         */
        public sort(): void {

            if(this._sortPredicate === null || this._sortPredicate === undefined) {
                return;
            }

            this._data = _.sortBy(this._data, this._sortPredicate);

            this.events.trigger(SortedListEvents.SORT);
            this.events.trigger(SortedListEvents.CHANGE);
        }
    }
}