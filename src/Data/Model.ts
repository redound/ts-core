import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";
import * as _ from "underscore";


export interface ModelInterface {
    new (data?:any):Model;
    primaryKey();
    whitelist():string[];
    defaults();
}

export default class Model extends BaseObject {

    constructor(data?:any) {

        super();

        _.defaults(this, this.source.defaults());

        if (data) {
            this.assignAll(data);
        }
    }

    public set(key:string, value:any) {
        this[key] = value;
    }

    public get(key:string) {
        return this[key];
    }

    public static primaryKey() {
        return 'id';
    }

    public static whitelist():string[] {
        return [];
    }

    public static defaults():any {
        return {};
    }

    public getId() {

        return this[this.source.primaryKey()];
    }

    public assign(data?:any):this {

        _.each(this.source.whitelist(), (attr:string) => {

            if (!_.isUndefined(data[attr])) {
                this[attr] = data[attr];
            }
        });

        return this;
    }

    public assignAll(data?:any) {

        _.each(data, (value:any, attr:string) => {
            if (!_.isUndefined(data[attr])) {
                this[attr] = data[attr];
            }
        });

        return this;
    }

    public merge(model:Model) {

        this.assignAll(model.toObject());
    }

    public equals(data:any):boolean {

        if (data instanceof Model) {
            data = data.toObject();
        }

        var equal:boolean = true;

        _.each(this.getDataKeys(), (key) => {

            if (equal && this[key] != data[key]) {
                equal = false;
            }
        });

        return equal;
    }

    public getDataKeys():string[] {

        return _.filter(_.keys(this), (key) => {

            return !/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(key.slice(0, 1));
        });
    }

    public toObject(recursive:boolean = false, skipObjects: any[] = []): any {

        var result = {};

        var parse = (value) => {

            return recursive ? Model.recursiveToObject(value, skipObjects.concat([this])) : value;
        };

        _.each(this.getDataKeys(), (key) => {

            var value = this[key];
            var parsedValue = _.isArray(value) ? _.map(value, parse) : parse(value);
            
            if(parsedValue != this) {
                result[key] = _.clone(parsedValue);
            }
        });

        return result;
    }

    public static recursiveToObject(data: any, skipObjects: any[] = []){

        var result = data;

        if (data instanceof Model) {

            result = (<Model>data).toObject(true, skipObjects);

            // Prevent loop
            if(skipObjects && skipObjects.length) {

                _.each(_.clone(result), (parsedFieldVal, parsedFieldKey) => {

                    if (_.contains(skipObjects, parsedFieldVal)) {
                        delete result[parsedFieldKey]
                    }
                });
            }
        }

        return result;
    }

    public toString() {
        return "Model";
    }
}
