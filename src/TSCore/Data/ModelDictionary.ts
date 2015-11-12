/// <reference path="./Collection.ts" />

module TSCore.Data {

    export class ModelDictionary<K, V extends Model> extends Dictionary<K, V> {

        protected _primaryKey:string;
        protected _modelClass:IModelInterface;

        constructor(modelClass:IModelInterface, primaryKey?: string, data?: IDictionaryData){

            this._modelClass = modelClass;
            this._primaryKey = primaryKey || 'id';

            super(data);
        }

        public addManyData(data: {}[]){

            _.each(data, (item) => {
                this.set(data[this._primaryKey], this._instantiateModel(item));
            });
        }

        public addData(data: {}){

            this.set(data[this._primaryKey], this._instantiateModel(data));
        }

        public toArray(): any[] {

            return _.map(super.toArray(), (item: V) => {
                return item.toObject();
            });
        }

        public toObject(): {} {

            return _.mapObject(super.toObject, (item: V) => {
                return item.toObject();
            });
        }

        protected _instantiateModel(data: {}): V {
            return <V>new this._modelClass(data);
        }
    }
}