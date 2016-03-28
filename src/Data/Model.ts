import BaseObject from "../BaseObject";
import EventEmitter from "../Events/EventEmitter";

export interface ModelInterface {
    new (data?:any):Model;
    primaryKey();
    whitelist():string[];
    defaults();
}

export default class Model extends BaseObject {

    public events:EventEmitter= new EventEmitter();

    constructor(data?:any) {

        super();

        _.defaults(this, this.static.defaults());

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

        return this[this.static.primaryKey()];
    }

    public assign(data?:any):this {

        _.each(this.static.whitelist(), (attr:string) => {

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

            return key.slice(0, 1) != '_';
        });
    }

    public toObject(recursive:boolean = false) {

        var result = {};

        _.each(this.getDataKeys(), (key) => {

            var value = this[key];
            var parsedValue = value;

            if (recursive && value instanceof Model) {
                parsedValue = (<Model>value).toObject();
            }

            result[key] = parsedValue;
        });

        return result;
    }
}
