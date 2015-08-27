/// <reference path="../../Event/EventEmitter.ts" />

module TSCore.Data.Collection {

    export class Set<T> extends TSCore.Events.EventEmitter {

        public static EVENTS = {

            CHANGE: 'change',
            ADD: 'add',
            REMOVE: 'remove',
            REPLACE: 'replace',
            CLEAR: 'clear'
        };

        public get length():number {
            return this.count();
        }

        protected _data:T[];


        constructor(data?:T[]){

            super();
            this._data = data || [];
        }

        public add(item:T) {

            this._data.push(item);

            this.trigger(Set.EVENTS.ADD, [item], this);
            this.trigger(Set.EVENTS.CHANGE, this);
        }

        public addMany(items:T[]){

            this._data = this._data.concat(items);

            this.trigger(Set.EVENTS.ADD, items, this);
            this.trigger(Set.EVENTS.CHANGE, this);
        }

        public remove(item:T){

            this._data = _.without(this._data, item);

            this.trigger(Set.EVENTS.REMOVE, [item], this);
            this.trigger(Set.EVENTS.CHANGE, this);
        }

        public removeMany(items:T[]){

            this._data = _.difference(this._data, items);

            this.trigger(Set.EVENTS.REMOVE, items, this);
            this.trigger(Set.EVENTS.CHANGE, this);
        }

        public removeWhere(properties:{}){
            this.removeMany(this.where(properties));
        }

        public replaceItem(source:T, replacement:T): T {

            var index = _.indexOf(this._data, source);

            if (index < 0 || index >= this.count()) {
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            this.trigger(Set.EVENTS.REPLACE, source, replacement, this);
            this.trigger(Set.EVENTS.CHANGE, this);

            return currentItem;
        }

        public clear() {

            this._data = [];

            this.trigger(Set.EVENTS.REMOVE, this.toArray(), this);
            this.trigger(Set.EVENTS.CLEAR, this);
            this.trigger(Set.EVENTS.CHANGE, this);
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