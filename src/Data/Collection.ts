import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export interface ICollectionOperation<T> {
    item:T,
    index:number
}

export module CollectionEvents {

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
        operations:ICollectionOperation<T>[]
    }

    export interface IRemoveParams<T> {
        operations:ICollectionOperation<T>[],
        clear:boolean
    }

    export interface IReplaceParams<T> {
        source:T,
        replacement:T
    }
}

export default class Collection<T> extends BaseObject {

    protected _data:T[];
    public events:EventEmitter = new EventEmitter();


    constructor(data?:T[]) {

        super();
        this._data = data || [];
    }

    /**
     * Get length of Collection. (same as method count)
     *
     * @returns {number}
     */
    public get length():number {
        return this.count();
    }

    /**
     * Get count of Collection. (same as property length)
     *
     * @returns {number}
     */
    public count():number {
        return this._data.length;
    }

    /**
     * Add (push) item to Collection.
     *
     * @param item Item to be added.
     */
    public add(item:T):T {

        if (this.contains(item)) {
            return null;
        }

        this._data.push(item);

        var addedItems = [{
            item: item,
            index: this.indexOf(item)
        }]

        this.events.trigger(CollectionEvents.ADD, {operations: addedItems});
        this.events.trigger(CollectionEvents.CHANGE);

        return item;
    }

    /**
     * Add multiple (concat) items to Collection.
     *
     * @param items Items to be added.
     */
    public addMany(items:T[]):T[] {

        // Remove existing items
        var itemsToAdd = [];

        _.each(items, (item) => {

            if (!this.contains(item)) {
                itemsToAdd.push(item);
            }
        });

        if (itemsToAdd.length > 0) {

            this._data = this._data.concat(itemsToAdd);

            var addedItems = _.map(itemsToAdd, item => {

                return {
                    item: item,
                    index: this.indexOf(item)
                }
            });

            this.events.trigger(CollectionEvents.ADD, {operations: addedItems});
            this.events.trigger(CollectionEvents.CHANGE);
        }

        return itemsToAdd;
    }

    /**
     * Remove item from Collection.
     *
     * @param item Item to be removed.
     */
    public remove(item:T) {

        var removedItems = [{
            item: item,
            index: this.indexOf(item)
        }];

        this._data = _.without(this._data, item);

        this.events.trigger(CollectionEvents.REMOVE, {operations: removedItems, clear: false});
        this.events.trigger(CollectionEvents.CHANGE);
    }

    /**
     * Remove multiple items from Collection.
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

        this.events.trigger(CollectionEvents.REMOVE, {operations: removedItems, clear: false});
        this.events.trigger(CollectionEvents.CHANGE);
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
     * Replace an item with another item in Collection
     *
     * TODO: Discussion - Should there be a recursiveReplaceItem() that will replace duplicates?
     *
     * @param source    The item that gets replaced inside the Collection.
     * @param replacement The item that replaces the source item.
     * @returns {any}
     */
    public replaceItem(source:T, replacement:T):T {

        var index = _.indexOf(this._data, source);

        if (index < 0 || index >= this.count()) {
            return null;
        }

        var currentItem = this._data[index];
        this._data[index] = replacement;

        this.events.trigger(CollectionEvents.REPLACE, {source: source, replacement: replacement});
        this.events.trigger(CollectionEvents.CHANGE);

        return currentItem;
    }

    /**
     * Clears the Collection.
     */
    public clear() {

        var removedItems = _.map(this._data, (item, index) => {
            return {
                item: item,
                index: index
            }
        });

        this._data = [];

        this.events.trigger(CollectionEvents.REMOVE, {operations: removedItems, clear: true});
        this.events.trigger(CollectionEvents.CLEAR);
        this.events.trigger(CollectionEvents.CHANGE);
    }

    /**
     * Iterates over all item in Collection, yielding each in turn to an iteratee function.
     *
     * @param iterator Iteratee function.
     */
    public each(iterator:_.ListIterator<T, void>) {
        _.each(this._data, iterator);
    }

    /**
     * The pluck method retrieves all of the collection values for a given key
     *
     * @param propertyName
     * @returns {Collection<string>|Collection}
     */
    public pluck<S>(propertyName:string):Collection<S> {
        var data = _.pluck(_.clone(this._data), propertyName);
        return new Collection<S>(data);
    }

    /**
     * Check whether the Collection is empty.
     *
     * @returns {boolean}
     */
    public isEmpty():boolean {
        return this.count() === 0;
    }

    /**
     * Filter items using an optional iterator.
     *
     * @param iterator Iterator to use.
     * @returns {T[]}
     */
    public filter(iterator?:_.ListIterator<T, boolean>):T[] {
        return _.filter(this._data, iterator);
    }

    /**
     * Get the index of an item in collection.
     *
     * @param item Item to return index for.
     * @returns {number}
     */
    public indexOf(item:T):number {
        return _.indexOf(this._data, item);
    }

    /**
     * Find item using an iterator.
     *
     * @param iterator
     * @returns {T}
     */
    public find(iterator?:_.ListIterator<T, boolean>):T {
        return _.find(this._data, iterator);
    }

    /**
     * Looks through each value in the list, returning an array of all the values that contain all
     * of the key-value pairs listed in properties.
     *
     * ````js
     * Collection.where({author: "Shakespeare", year: 1611});
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
     * Check if Collection contains item.
     *
     * @param item Item to check against.
     * @returns {boolean}
     */
    public contains(item:T):boolean {
        return _.contains(this._data, item);
    }

    /**
     * Map values using an iterator returning a new instance
     * @param iterator
     * @param context
     * @returns {Collection<S>|Collection} returns new Collection
     */
    public map<S>(iterator:_.ListIterator<T, any>, context?:any):Collection<S> {
        var data = _.map<T, S>(_.clone(this._data), iterator, context);
        return new Collection<S>(data);
    }

    /**
     * Tranform values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection|Collection}
     */
    public transform(iterator:_.ListIterator<T, any>, context?:any):Collection<T> {
        this._data = _.map<T, T>(this._data, iterator, context);
        return this;
    }

    /**
     * Reject values using an iterator
     * @param iterator
     * @param context
     * @returns {Collection} Returns new Collection
     */
    public reject(iterator:_.ListIterator<T, any>, context?:any):Collection<T> {
        var data = _.reject<T>(_.clone(this._data), iterator, context);
        return new Collection(data);
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

    public clone():Collection<T> {
        return new Collection<T>(_.clone(this._data));
    }
}
