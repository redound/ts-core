/// <reference path="./Collection.ts" />

module TSCore.Data {

    export interface IModelInterface {
        new (data: {}): Model;
    }

    export class ModelCollection<T extends Model> extends Collection<T> {

        protected _primaryKey:string;
        protected _modelClass:IModelInterface;

        constructor(modelClass:IModelInterface, primaryKey?: string, data?: T[]){

            this._modelClass = modelClass;
            this._primaryKey = primaryKey || 'id';

            super(data);
        }

        public addManyData(data: {}[]){

            var createdModels = [];

            _.each(data, (item) => {
                createdModels.push(this._instantiateModel(item));
            });

            this.addMany(createdModels);
        }

        public addData(data: {}){

            this.add(this._instantiateModel(data));
        }

        public contains(item:T): boolean {

            var predicate = {};
            predicate[this._primaryKey] = item[this._primaryKey];

            return this.whereFirst(predicate) != null;
        }

        /**
         * Convert Collection to array.
         *
         * @returns {any[]}
         */
        public toArray():any[] {

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