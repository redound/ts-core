/// <reference path="../../typings/main.d.ts" />
import Model from "./Model";
import { ModelInterface } from "./Model";
import Collection from "./Collection";
export default class ModelCollection<T extends Model> extends Collection<T> {
    protected _modelClass: ModelInterface;
    constructor(modelClass: ModelInterface, data?: T[]);
    addManyData(data: {}[]): T[];
    addData(data: {}): T;
    contains(item: T): boolean;
    /**
     * Retrieve copy of data as an array
     *
     * @returns {any[]}
     */
    all(): T[];
    /**
     * Convert Collection to array.
     *
     * @returns {any[]}
     */
    toArray(): T[];
    protected _instantiateModel(data: {}): T;
}
