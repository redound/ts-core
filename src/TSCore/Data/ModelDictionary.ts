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

        public addManyData(data: {}[]): V[] {

            var addedItems = [];

            _.each(data, (item) => {

                var instance = this._instantiateModel(item);
                this.set(data[this._primaryKey], instance);

                addedItems.push(instance);
            });

            return addedItems;
        }

        public addData(data: {}): V {

            var instance = this._instantiateModel(data);
            this.set(data[this._primaryKey], instance);

            return instance;
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