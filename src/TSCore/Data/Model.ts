module TSCore.Data {

    export interface IModelInterface {
        new (data: {}): Model;
    }

    export class Model {

        protected _defaults: {};
        protected _whitelist: string[];

        constructor(data?:{}) {

            this._defaults = this.defaults();
            this._whitelist = this.whitelist();

            _.defaults(this, this._defaults);

            if(data) {
               this.assign(data);
            }
        }

        protected whitelist(): string[] {
            return [];
        }
        protected defaults(): {} {
            return {}
        }


        public assign(data?: any) {

            _.each(this._whitelist, (attr: string) => {
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