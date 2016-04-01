import Model, { ModelInterface } from "./Model";
import Collection from "./Collection";
export default class ModelCollection<T extends Model> extends Collection<T> {
    protected modelClass: ModelInterface;
    constructor(modelClass: ModelInterface, data?: T[]);
    addManyData(data: {}[]): T[];
    addData(data: {}): T;
    contains(item: T): boolean;
    all(): T[];
    toArray(): T[];
    protected _instantiateModel(data: {}): T;
}
