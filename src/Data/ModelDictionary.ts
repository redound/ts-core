import {ModelInterface, default as Model} from "./Model";
import Dictionary, {DictionaryDataInterface} from "./Dictionary";
import * as _ from "underscore";


export default class ModelDictionary<K, V extends Model> extends Dictionary<K, V> {

    protected modelClass:ModelInterface;

    constructor(modelClass:ModelInterface, data?:DictionaryDataInterface) {

        super(data);

        this.modelClass = modelClass;
    }

    public addManyData(data:{}[]):V[] {

        var addedItems = [];

        _.each(data, (item) => {

            var instance = this._instantiateModel(item);
            this.set(item[this.modelClass.primaryKey()], instance);

            addedItems.push(instance);
        });

        return addedItems;
    }

    public addData(data:{}):V {

        var instance = this._instantiateModel(data);
        this.set(data[this.modelClass.primaryKey()], instance);

        return instance;
    }

    public toArray():any[] {

        return _.map(super.toArray(), (item:V) => {
            return item.toObject();
        });
    }

    public toObject():{} {

        return _.mapObject(super.toObject, (item:V) => {
            return item.toObject();
        });
    }

    protected _instantiateModel(data:{}):V {
        return <V>new this.modelClass(data);
    }
}
