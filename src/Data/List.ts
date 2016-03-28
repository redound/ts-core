import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export interface ListOperationInterface<T> {
    item:T,
    index:number
}

export module ListEvents {

    export const ADD:string = "add";
    export const CHANGE:string = "change";
    export const REMOVE:string = "remove";
    export const REPLACE:string = "replace";
    export const CLEAR:string = "clear";

    export interface IChangeParams<T> {
    }
    export interface IClearParams<T> {
    }

    export interface IAddParams<T> {
        operations:ListOperationInterface<T>[],
        clear:boolean
    }

    export interface IRemoveParams<T> {
        operations:ListOperationInterface<T>[]
    }

    export interface IReplaceParams<T> {
        source:T,
        replacement:T
    }
}

export default class List<T> extends BaseObject {

    protected _data:T[];
    public events:EventEmitter = new EventEmitter();

    constructor(data?:T[]) {

        super();
        this._data = data || [];
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

        var count = this._data.push(item);

        var addedItems = [{item: item, index: count - 1}];

        this.events.trigger(ListEvents.ADD, {operations: addedItems});
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Add multiple (concat) items to List.
     *
     * @param items Items to be added.
     */
    public addMany(items:T[] = []) {

        this._data = this._data.concat(items);

        var index = this._data.length;
        var addedItems = [];

        _.each(items, item => {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });

        this.events.trigger(ListEvents.ADD, {operations: addedItems});
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Prepend item to list.
     *
     * @param item  Item to be inserted.
     */
    public prepend(item:T) {
        this.insert(item, 0);
    }

    /**
     * Prepend multiple items to list.
     *
     * @param items Items to be inserted
     */
    public prependMany(items:T[]) {

        this._data = items.concat(this._data);

        var index = 0;
        var addedItems = [];

        _.each(items, item => {
            addedItems.push({
                item: item,
                index: index
            });
            index++;
        });

        this.events.trigger(ListEvents.ADD, {operations: addedItems});
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Insert an item at a certain index.
     *
     * @param item  Item to be inserted.
     * @param index Index to insert item at.
     */
    public insert(item:T, index:number) {

        this._data.splice(index, 0, item);

        var addedItems = [{
            item: item,
            index: index
        }];

        this.events.trigger(ListEvents.ADD, {operations: addedItems});
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Remove item from List.
     *
     * @param item Item to be removed.
     */
    public remove(item:T) {

        var index = this.indexOf(item);
        this._data = _.without(this._data, item);

        var removedItems = [{
            item: item,
            index: index
        }];

        this.events.trigger(ListEvents.REMOVE, {operations: removedItems});
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Remove item at index
     * @param index
     */
    public removeAt(index:number) {

        var item = this.get(index);
        this.remove(item);
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

        this.events.trigger(ListEvents.REMOVE, {operations: removedItems});
        this.events.trigger(ListEvents.CHANGE);
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
        return this.replace(this.indexOf(source), replacement);
    }

    /**
     * Replace an item at a certain index.
     *
     * @param index         Index of the item that gets replaced.
     * @param replacement   The item the replaces the source item.
     * @returns {any}
     */
    public replace(index:number, replacement:T):T {

        if (index < 0 || index >= this.count()) {
            return null;
        }

        var currentItem = this._data[index];
        this._data[index] = replacement;

        this.events.trigger(ListEvents.REPLACE, {source: currentItem, replacement: replacement});
        this.events.trigger(ListEvents.CHANGE);

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
        this.events.trigger(ListEvents.REMOVE, {operations: removedItems, clear: true});
        this.events.trigger(ListEvents.CLEAR);
        this.events.trigger(ListEvents.CHANGE);
    }

    /**
     * Iterates over all item in List, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    public each(iterator:_.ListIterator<T, void>) {
        _.each(this._data, iterator);
    }

    public map<S>(iterator:_.ListIterator<T, any>, context?:any):List<S> {
        var data = _.map<T, S>(this._data, iterator, context);
        return new List(data);
    }

    /**
     * The pluck method retrieves all of the list values for a given key
     *
     * @param propertyName
     * @returns {List<S>|List}
     */
    public pluck<S>(propertyName:string):List<S> {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new List<S>(data);
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
     * Sort list.
     *
     * @returns {void}
     */
    public sort(sortPredicate:any):void {

        this._data = _.sortBy(this._data, sortPredicate);

        this.events.trigger(ListEvents.CHANGE);
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
     * Retrieve copy of data as an array
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

    public clone():List<T> {
        return new List<T>(_.clone(this._data));
    }
}
