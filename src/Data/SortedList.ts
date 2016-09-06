import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
import * as _ from "underscore";

export interface ISortedListOperation<T> {
    item:T,
    index:number
}

export const SortedListEvents = {
    ADD: 'add',
    CHANGE: 'change',
    REMOVE: 'remove',
    REPLACE: 'replace',
    CLEAR: 'clear',
    SORT: 'sort'
};

export interface SortedListChangeParamsInterface<T> {
}

export interface SortedListClearParamsInterface<T> {
}

export interface SortedListSortParamsInterface<T> {
}

export interface SortedListAddParamsInterface<T> {
    operations:ISortedListOperation<T>[]
}

export interface SortedListRemoveParamsInterface<T> {
    operations:ISortedListOperation<T>[],
    clear:boolean
}

export interface SortedListReplaceParamsInterface<T> {
    source:T,
    replacement:T
}

export enum SortedListDirection {
    ASCENDING,
    DESCENDING
}

export default class SortedList<T> extends BaseObject {

    protected sortPredicate;
    protected sortDirection:SortedListDirection;
    protected data:T[];
    public events:EventEmitter = new EventEmitter();

    /**
     * Constructor function
     * @param data Data to populate list of instance with.
     * @param sortPredicate Predicate to sort list to.
     */
    constructor(data:T[] = null, sortPredicate = null, direction:SortedListDirection = SortedListDirection.ASCENDING) {

        super();

        this.data = data || [];
        this.sortPredicate = sortPredicate;
        this.sortDirection = direction;

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
        return this.data.length;
    }

    /**
     * Add (push) item to List.
     *
     * @param item Item to be added.
     */
    public add(item:T) {

        var sortedIndex = this.sortedIndex(item);

        this.data.splice(sortedIndex, 0, item);

        var addedItems = [{item: item, index: sortedIndex}];

        this.events.trigger(SortedListEvents.ADD, {operations: addedItems});
        this.events.trigger(SortedListEvents.CHANGE);
    }

    protected sortedIndex(item:T) {

        var target = _.clone(this.data);

        if (this.sortDirection === SortedListDirection.DESCENDING) {
            target.reverse();
        }

        return _.sortedIndex(target, item, this.sortPredicate);
    }

    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
    public addMany(items:T[] = []) {

        this.data = this.data.concat(items);
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

        this.data = _.without(this.data, item);
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

        this.data = _.difference(this.data, items);
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

        var index = _.indexOf(this.data, source);

        if (index < 0 || index >= this.count()) {
            return null;
        }

        var currentItem = this.data[index];
        this.data[index] = replacement;

        this.sort();

        this.events.trigger(SortedListEvents.REPLACE, {source: source, replacement: replacement});
        this.events.trigger(SortedListEvents.CHANGE);

        return currentItem;
    }

    /**
     * Clears the List.
     */
    public clear() {

        var removedItems = _.map(this.data, (item, index) => {
            return {
                item: item,
                index: index
            }
        });

        this.data = [];
        this.events.trigger<SortedListRemoveParamsInterface<T>>(SortedListEvents.REMOVE, {
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
        _.each(this.data, iterator);
    }

    public map<S>(iterator:_.ListIterator<T, any>, context?:any):SortedList<S> {
        var data = _.map<T, S>(this.data, iterator, context);
        return new SortedList(data, this.sortPredicate, this.sortDirection);
    }

    /**
     * A convenient version of what is perhaps the most common use-case for map:
     * extracting a list of property values.
     *
     * @param propertyName Property name to pluck.
     * @returns {any[]}
     */
    public pluck(propertyName:string):any[] {
        return _.pluck(this.data, propertyName);
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
        return _.first(this.data);
    }

    /**
     * Get the last item from list.
     * @returns {T}
     */
    public last():T {
        return _.last(this.data);
    }

    /**
     * Get an item at a specified index in list.
     *
     * @param index Index of the item to be returned.
     * @returns {T}
     */
    public get(index:number):T {
        return this.data[index];
    }

    /**
     * Get the index of an item in list.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    public indexOf(item:T):number {
        return _.indexOf(this.data, item);
    }

    /**
     * Find items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    public find(iterator?:_.ListIterator<T, boolean>):T[] {
        return _.filter(this.data, iterator);
    }

    /**
     * Find first item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    public findFirst(iterator?:_.ListIterator<T, boolean>):T {
        return _.find(this.data, iterator);
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
        return _.where(this.data, properties);
    }

    /**
     * Looks through the list and returns the first value that matches all of the key-value pairs
     * listed in properties.
     *
     * @param properties Object containing key-value pairs.
     * @returns {T}
     */
    public whereFirst(properties:{}):T {
        return _.findWhere(this.data, properties);
    }

    /**
     * Check if List contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    public contains(item:T):boolean {
        return _.contains(this.data, item);
    }

    /**
     * Convert List to array.
     *
     * @returns {any[]}
     */
    public toArray():T[] {
        return _.clone(this.data);
    }

    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    public all():T[] {
        return _.clone(this.data);
    }

    public clone():SortedList<T> {
        return new SortedList<T>(_.clone(this.data), this.sortPredicate);
    }

    /**
     * Resort list.
     *
     * @returns {void}
     */
    public sort():void {

        if (this.sortPredicate === null || this.sortPredicate === undefined) {
            return;
        }

        this.data = _.sortBy(this.data, this.sortPredicate);

        if (this.sortDirection === SortedListDirection.DESCENDING) {
            this.data.reverse();
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
        this.sortPredicate = predicate;
        this.sortDirection = direction;
        this.sort();
    }

    /**
     * Get the current sortPredicate
     * @returns {any}
     */
    public getSortPredicate() {
        return this.sortPredicate;
    }

    public isAscending() {
        return this.sortDirection === SortedListDirection.ASCENDING;
    }

    public isDescending() {
        return this.sortDirection === SortedListDirection.DESCENDING;
    }

    public getSortDirection():SortedListDirection {
        return this.sortDirection;
    }
}
