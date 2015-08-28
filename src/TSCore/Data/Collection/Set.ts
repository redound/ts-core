/// <reference path="../../Event/EventEmitter.ts" />

module TSCore.Data.Collection {

    export module SetEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const REPLACE:string = "replace";
        export const CLEAR:string = "clear";

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

        public get length():number {
            return this.count();
        }

        public add(item:T) {

            this._data.push(item);

            this.trigger(SetEvents.ADD, { items: [item] });
            this.trigger(SetEvents.CHANGE);
        }

        public addMany(items:T[]) {

            this._data = this._data.concat(items);

            this.trigger(SetEvents.ADD, { items: [items] });
            this.trigger(SetEvents.CHANGE);
        }

        public remove(item:T) {

            this._data = _.without(this._data, item);

            this.trigger(SetEvents.REMOVE, { items: [item] });
            this.trigger(SetEvents.CHANGE);
        }

        public removeMany(items:T[]) {

            this._data = _.difference(this._data, items);

            this.trigger(SetEvents.REMOVE, { items: items });
            this.trigger(SetEvents.CHANGE);
        }

        public removeWhere(properties: {}) {
            this.removeMany(this.where(properties));
        }

        public replaceItem(source:T, replacement:T): T {

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

        public clear() {

            this._data = [];

            this.trigger(SetEvents.REMOVE, { items: this.toArray() });
            this.trigger(SetEvents.CLEAR);
            this.trigger(SetEvents.CHANGE);
        }

        public each(iterator:_.ListIterator<T, void>){
            _.each(this._data, iterator)
        }

        public pluck(propertyName:string) : any[] {
            return _.pluck(this._data, propertyName);
        }

        public count(): number {
            return this._data.length;
        }

        public isEmpty(): boolean {
            return this.count() === 0;
        }

        public populate(items) {

            _.each(items, (itemData) => {

                var model = this._createItem(itemData);
                if (model) {
                    return this.add(model);
                }
            });
        }

        public find(iterator:_.ListIterator<T, boolean>): T[] {
            return _.filter(this._data, iterator);
        }

        public findFirst(iterator:_.ListIterator<T, boolean>): T {
            return _.find(this._data, iterator);
        }

        public where(properties:{}): T[] {
            return _.where(this._data, properties);
        }

        public whereFirst(properties:{}): T {
            return _.findWhere(this._data, properties);
        }

        public contains(item:T): boolean {
            return _.contains(this._data, item);
        }

        public toArray():T[] {
            return _.clone(this._data);
        }

        protected _createItem(itemData): T {
            return itemData;
        }
    }
}