/// <reference path="./List.ts" />

module TSCore.Data {

    export class ModelList<T extends Model> extends List<T> {

        protected _modelClass: IModelInterface;

        constructor(modelClass: IModelInterface, data?: T[]){

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