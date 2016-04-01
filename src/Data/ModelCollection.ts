import Model, {ModelInterface} from "./Model";
import Collection from "./Collection";
import * as _ from "underscore";

export default class ModelCollection<T extends Model> extends Collection<T> {

    public modelClass:ModelInterface;

    constructor(modelClass:ModelInterface, data?:T[]) {

        super(data);

        this.modelClass = modelClass;
    }

    public addManyData(data:{}[]) {

        var createdModels = [];

        _.each(data, (item) => {
            createdModels.push(this._instantiateModel(item));
        });

        return this.addMany(createdModels);
    }

    public addData(data:{}) {

        return this.add(this._instantiateModel(data));
    }

    public contains(item:T):boolean {

        var primaryKey = this.modelClass.primaryKey();

        var predicate = {};
        predicate[primaryKey] = item[primaryKey];

        return this.whereFirst(predicate) != null;
    }

    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    public all():T[] {
        return _.clone(this.data);
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

    protected _instantiateModel(data:{}):T {
        return <T>new this.modelClass(data);
    }
}
