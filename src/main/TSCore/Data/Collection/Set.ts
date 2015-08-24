/// <reference path="../../../tscore.d.ts" />

module TSCore.Data.Collection {

    export class Set<T> {

        public get length():number {
            return this.count();
        }

        protected _data:T[];


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

        public replaceItem(source:T, replacement:T): T {

            var index = _.indexOf(this._data, source);

            if (index < 0 || index >= this.count()) {
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            return currentItem;
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