
module TSCore.Data {

    export abstract class Model {

        protected _defaults = {};
        protected _whitelist = [];

        constructor(data?:{}) {

            _.defaults(this, this._defaults);

            if(data) {
               this.assign(data);
            }
        }

        public assign(data?: any) {

            _.each(this._whitelist, (attr: string) => {
                this[attr] = !_.isUndefined(data[attr]) ? data[attr] : this[attr] || null;
            });

            return this;
        }

        public toObject() {

            var result = {};

            _.each(this, function(value, key){

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