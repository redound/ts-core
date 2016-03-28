import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export interface ISortedListOperation<T> {
    item:T,
    index:number
}

export module SortedListEvents {

    export const ADD:string = "add";
    export const CHANGE:string = "change";
    export const REMOVE:string = "remove";
    export const REPLACE:string = "replace";
    export const CLEAR:string = "clear";
    export const SORT:string = "sort";

    export interface IChangeParams<T> {
    }
    export interface IClearParams<T> {
    }
    export interface ISortParams<T> {
    }

    export interface IAddParams<T> {
        operations:ISortedListOperation<T>[]
    }

    export interface IRemoveParams<T> {
        operations:ISortedListOperation<T>[],
        clear:boolean
    }

    export interface IReplaceParams<T> {
        source:T,
        replacement:T
    }
}

export enum SortedListDirection {
    ASCENDING,
    DESCENDING
}

export default class SortedList<T> extends BaseObject {

    protected _sortPredicate;
    protected _sortDirection:SortedListDirection;
    protected _data:T[];
    public events:EventEmitter = new EventEmitter();

    /**
     * Constructor function
     * @param data Data to populate list of instance with.
     * @param sortPredicate Predicate to sort list to.
     */
    constructor(data:T[] = null, sortPredicate = null, direction:SortedListDirection = SortedListDirection.ASCENDING) {

        super();

        this._data = data || [];
        this._sortPredicate = sortPredicate;
        this._sortDirection = direction;

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
    public count():number {
        return this._data.length;
    }

    /**
     * Add (push) item to List.
     *
     * @param item Item to be added.
     */
    public add(item:T) {

        var sortedIndex = this.sortedIndex(item);

        this._data.splice(sortedIndex, 0, item);

        var addedItems = [{item: item, index: sortedIndex}];

        this.events.trigger(SortedListEvents.ADD, {operations: addedItems});
        this.events.trigger(SortedListEvents.CHANGE);
    }

    protected sortedIndex(item:T) {

        var target = _.clone(this._data);

        if (this._sortDirection === SortedListDirection.DESCENDING) {
            target.reverse();
        }

        return _.sortedIndex(target, item, this._sortPredicate);
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

        this.events.trigger(SortedListEvents.ADD, {operations: addedItems});
        this.events.trigger(SortedListEvents.CHANGE);
    }

    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
    public remove(item:T) {

        var removedItems = [{
            item: item,
            index: this.indexOf(item)
        }];

        this._data = _.without(this._data, item);
        this.sort();

        this.events.trigger(SortedListEvents.REMOVE, {operations: removedItems, clear: false});
        this.events.trigger(SortedListEvents.CHANGE);
    }

    /**
     * Remove multiple items from List.
     *
     * @param items Items to be removed.
     */
    public removeMany(items:T[]) {

        var removedItems = _.map(items, item => {
            return {
                item: item,
                index: this.indexOf(item)
            };
        });

        this._data = _.difference(this._data, items);
        this.sort();

        this.events.trigger(SortedListEvents.REMOVE, {operations: removedItems, clear: false});
        this.events.trigger(SortedListEvents.CHANGE);
    }

    /**
     * Remove items using properties.
     *
     * @param properties    Object containing key-value pairs.
     */
    public removeWhere(properties:any) {
        this.removeMany(this.where(properties));
    }

    /**
     * Replace an item with another item.
     *
     * @param source        The item that gets replaced inside the list.
     * @param replacement   The item that replaces the source item.
     * @returns {T}
     */
    public replaceItem(source:T, replacement:T):T {

        var index = _.indexOf(this._data, source);

        if (index < 0 || index >= this.count()) {
            return null;
        }

        var currentItem = this._data[index];
        this._data[index] = replacement;

        this.sort();

        this.events.trigger(SortedListEvents.REPLACE, {source: source, replacement: replacement});
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
        this.events.trigger<SortedListEvents.IRemoveParams<T>>(SortedListEvents.REMOVE, {
            operations: removedItems,
            clear: true
        });
        this.events.trigger(SortedListEvents.CLEAR);
        this.events.trigger(SortedListEvents.CHANGE);
    }

    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    public each(iterator:_.ListIterator<T, void>) {
        _.each(this._data, iterator);
    }

    public map<S>(iterator:_.ListIterator<T, any>, context?:any):SortedList<S> {
        var data = _.map<T, S>(this._data, iterator, context);
        return new SortedList(data, this._sortPredicate, this._sortDirection);
    }

    /**
     * A convenient version of what is perhaps the most common use-case for map:
     * extracting a list of property values.
     *
     * @param propertyName Property name to pluck.
     * @returns {any[]}
     */
    public pluck(propertyName:string):any[] {
        return _.pluck(this._data, propertyName);
    }

    /**
     * Check whether the List is empty.
     *
     * @returns {boolean}
     */
    public isEmpty():boolean {
        return this.count() === 0;
    }

    /**
     * Get the first item from list.
     *
     * @returns {T}
     */
    public first():T {
        return _.first(this._data);
    }

    /**
     * Get the last item from list.
     * @returns {T}
     */
    public last():T {
        return _.last(this._data);
    }

    /**
     * Get an item at a specified index in list.
     *
     * @param index Index of the item to be returned.
     * @returns {T}
     */
    public get(index:number):T {
        return this._data[index];
    }

    /**
     * Get the index of an item in list.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    public indexOf(item:T):number {
        return _.indexOf(this._data, item);
    }

    /**
     * Find items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    public find(iterator?:_.ListIterator<T, boolean>):T[] {
        return _.filter(this._data, iterator);
    }

    /**
     * Find first item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    public findFirst(iterator?:_.ListIterator<T, boolean>):T {
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
    public where(properties:{}):T[] {
        return _.where(this._data, properties);
    }

    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    public whereFirst(properties:{}):T {
        return _.findWhere(this._data, properties);
    }

    /**
     * Check if List contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    public contains(item:T):boolean {
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

    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    public all():T[] {
        return _.clone(this._data);
    }

    public clone():SortedList<T> {
        return new SortedList<T>(_.clone(this._data), this._sortPredicate);
    }

    /**
     * Resort list.
     *
     * @returns {void}
     */
    public sort():void {

        if (this._sortPredicate === null || this._sortPredicate === undefined) {
            return;
        }

        this._data = _.sortBy(this._data, this._sortPredicate);

        if (this._sortDirection === SortedListDirection.DESCENDING) {
            this._data.reverse();
        }

        this.events.trigger(SortedListEvents.SORT);
        this.events.trigger(SortedListEvents.CHANGE);
    }

    /** Set sortPredicate along with the sort direction
     *
     * @param predicate Predicate to set.
     * @param direction Direction to sort list to (ASC&DESC)
     */
    public setSortPredicate(predicate, direction:SortedListDirection = SortedListDirection.ASCENDING) {
        this._sortPredicate = predicate;
        this._sortDirection = direction;
        this.sort();
    }

    /**
     * Get the current sortPredicate
     * @returns {any}
     */
    public getSortPredicate() {
        return this._sortPredicate;
    }

    public isAscending() {
        return this._sortDirection === SortedListDirection.ASCENDING;
    }

    public isDescending() {
        return this._sortDirection === SortedListDirection.DESCENDING;
    }

    public getSortDirection():SortedListDirection {
        return this._sortDirection;
    }
}
