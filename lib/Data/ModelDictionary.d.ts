import { ModelInterface, default as Model } from "./Model";
import Dictionary, { DictionaryDataInterface } from "./Dictionary";
export default class ModelDictionary<K, V extends Model> extends Dictionary<K, V> {
    protected _modelClass: ModelInterface;
    constructor(modelClass: ModelInterface, data?: DictionaryDataInterface);
    addManyData(data: {}[]): V[];
    addData(data: {}): V;
    toArray(): any[];
    toObject(): {};
    protected _instantiateModel(data: {}): V;
}
