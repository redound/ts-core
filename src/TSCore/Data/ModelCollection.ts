/// <reference path="./Collection.ts" />

module TSCore.Data {

    export class ModelCollection<T extends Model> extends Collection<T> {

        protected _modelClass:IModel;

        constructor(modelClass:IModel, data?: T[]){

            this._modelClass = modelClass;

            super(data);
        }

        public addManyData(data: {}[]){

            var createdModels = [];

            _.each(data, (item) => {
                createdModels.push(this._instantiateModel(item));
            });

            return this.addMany(createdModels);
        }

        public addData(data: {}){

            return this.add(this._instantiateModel(data));
        }

        public contains(item:T): boolean {

            var primaryKey = this._modelClass.primaryKey();

            var predicate = {};
            predicate[primaryKey] = item[primaryKey];

            return this.whereFirst(predicate) != null;
        }

        /**
         * Retrieve copy of data as an array
         *
         * @returns {any[]}
         */
        public all(): T[] {
            return _.clone(this._data);
        }

        /**
         * Convert Collection to array.
         *
         * @returns {any[]}
         */
        public toArray():T[] {

            var result = [];

            this.each((item) => {
                result.push(item.toObject());
            });

            return result;
        }

        protected _instantiateModel(data: {}): T {
            return <T>new this._modelClass(data);
        }
    }
}