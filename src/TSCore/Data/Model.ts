
module TSCore.Data {

    export class Model {

        defaults = {};

        constructor(attrs) {

            _.each(attrs, (value, key) => {

                if (this.defaults[key] !== undefined) {
                    this[key] = value;
                }
            });
        }
    }
}