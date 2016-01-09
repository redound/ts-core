module TSCore.Data {

    export interface IModelInterface {
        new (data: {}): Model;

        primaryKey();
        whitelist();
        assign();
    }

    export class Model extends TSCore.BaseObject {

        protected _defaults: {};
        protected _whitelist: string[];

        constructor(data?:{}) {

            super();

            _.defaults(this, this.static.defaults());

            if(data) {
               this.assignAll(data);
            }
        }

        public static primaryKey() {
            return 'id';
        }

        public static whitelist(): string[] {
            return [];
        }
        public static defaults(): {} {
            return {};
        }

        public getId(){

            return this[this.static.primaryKey()];
        }

        public assign(data?: any) {

            _.each(this.static.whitelist(), (attr: string) => {
                this[attr] = !_.isUndefined(data[attr]) ? data[attr] : this[attr] || null;
            });

            return this;
        }

        public assignAll(data?: any) {

            _.each(data, (value: any, attr: string) => {
                this[attr] = data[attr] || null;
            });

            return this;
        }

        public merge(model: Model) {

            this.assignAll(model.toObject());
        }

        public equals(data: any): boolean {

            var equal: boolean = true;

            _.each(this.getDataKeys(), (key) => {

                if(equal && this[key] != data[key]){
                    equal = false;
                }
            });

            return equal;
        }

        public getDataKeys(): string[] {

            return _.filter(_.keys(this), (key) => {

                return key.slice(0, 1) != '_';
            });
        }

        public toObject(recursive: boolean = false) {

            var result = {};

            _.each(this.getDataKeys(), (key) => {

                var value = this[key];
                var parsedValue = value;

                if(recursive && value instanceof Model){
                    parsedValue = (<Model>value).toObject();
                }

                result[key] = parsedValue;
            });

            return result;
        }
    }
}