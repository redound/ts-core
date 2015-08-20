/// <reference path="../tsdata.d.ts" />

module TSData {

    export class Collection<T> {

        private data:[T];

        constructor(data?:[T]){
            this.data = data || [];
        }

        public add(item:T) {
            this.data.push(item);
        }

        public addAll(items:[T]){
            this.data = this.data.concat(items);
        }

        public remove(item:T){
            this.data = _.without(this.data, item);
        }

        public removeAll(items:[T]){
            this.data = _.difference(this.data, items);
        }

        public first():T {
            return _.first(this.data);
        }

        public last():T {
            return _.last(this.data);
        }

        public reset() {
            this.data = [];
        }

        public each(iterator:_.ListIterator<T, void>){
            _.each(this.data, iterator)
        }

        public pluck(propertyName:string):[any] {
            return _.pluck(this.data, propertyName);
        }

        public count():number {
            return this.data.length;
        }

        get length():number {
            return this.count();
        }

        public populate(items) {

            _.each(items, (itemData) => {

                var model = this.createItem(itemData);
                if (model) {
                    return this.add(model);
                }
            });
        }

        public find(iterator:_.ListIterator<T, boolean>):[T] {
            return _.find(this.data, iterator);
        }

        public filter(iterator:_.ListIterator<T, boolean>):[T] {
            return _.filter(this.data, iterator);
        }

        public where(properties:{}):[T] {
            return _.where(this.data, properties);
        }

        public findWhere(properties:{}):T {
            return _.findWhere(this.data, properties);
        }

        public toArray():[T] {
            return _.clone(this.data);
        }

        protected createItem(itemData):T {
            return itemData;
        }
    }
}