/// <reference path="../tsdata.d.ts" />

module TSData {

    export class Collection<T> {

        data:[T];

        add(item:T) {
            this.data.push(item);
        }

        buildModel(attrs):T {
            return null;
        }

        populate(items) {

            _.each(items, (item) => {

                var model = this.buildModel(item);

                if (model) {
                    return this.add(model);
                }

            });
        }

        find():[T] {

            return this.data;
        }

        findFirst():T {

            return this.data[0];
        }
    }
}