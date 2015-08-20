/// <reference path="../../src/tsdata.d.ts" />
declare module TSData {
    class Collection<T> {
        data: [T];
        add(item: T): void;
        buildModel(attrs: any): T;
        populate(items: any): void;
        find(): [T];
        findFirst(): T;
    }
}
