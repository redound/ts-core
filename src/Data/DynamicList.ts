import List from "./List";


export default class DynamicList<T> extends List<T> {

    public setRange(start:number, items:T[]) {

        if (start < 0) {
            throw 'Start index less than 0 (zero) not allowed.';
        }

        var rangeStartIndex = start;
        var rangeEndIndex = start + items.length;

        var dataEndIndex = Math.max(this.data.length, 0);

        for (var dataIndex = Math.min(dataEndIndex, rangeStartIndex); dataIndex < rangeEndIndex; dataIndex++) {

            this.data[dataIndex] = items[dataIndex - rangeStartIndex];

            if (this.data[dataIndex] === undefined) {
                this.data[dataIndex] = null;
            }
        }

    }

    public containsRange(start:number, length:number):boolean {

        var rangeStartIndex = start;
        var rangeEndIndex = start + length;

        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {

            if (!this.data[dataIndex]) {
                return false;
            }
        }

        return true;
    }

    public getRange(start:number, length:number):T[] {

        var rangeStartIndex = start;
        var rangeEndIndex = start + length;

        var items = [];

        for (var dataIndex = rangeStartIndex; dataIndex < rangeEndIndex; dataIndex++) {

            if (!this.data[dataIndex]) {
                return null;
            }

            items.push(this.data[dataIndex]);
        }

        return items;
    }
}
