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
               this.assign(data);
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


        public assign(data?: any) {

            _.each(this.static.whitelist(), (attr: string) => {
                this[attr] = !_.isUndefined(data[attr]) ? data[attr] : this[attr] || null;
            });

            return this;
        }

        public toObject() {

            var result = {};

            _.each(_.keys(this), (key) => {

                var value = this[key];

                if(key.slice(0, '_'.length) != '_'){

                    var parsedValue = value;

                    if(value instanceof Model){
                        parsedValue = (<Model>value).toObject();
                    }

                    result[key] = parsedValue;
                }
            });

            return result;
        }
    }
}