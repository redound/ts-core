/// <reference path="../../../tscore.d.ts" />

module TSCore.Data.Collection {

    export class Collection<T> {

        public get length():number {
            return this.count();
        }

        private _data:T[];


        constructor(data?:T[]){
            this._data = data || [];
        }

        public add(item:T) {
            this._data.push(item);
        }

        public addMany(items:T[]){
            this._data = this._data.concat(items);
        }

        public remove(item:T){
            this._data = _.without(this._data, item);
        }

        public removeMany(items:T[]){
            this._data = _.difference(this._data, items);
        }

        public first(): T {
            return _.first(this._data);
        }

        public last(): T {
            return _.last(this._data);
        }

        public clear() {
            this._data = [];
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

        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
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