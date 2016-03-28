/// <reference path="../../typings/main.d.ts" />
import List from "./List";
export default class DynamicList<T> extends List<T> {
    setRange(start: number, items: T[]): void;
    containsRange(start: number, length: number): boolean;
    getRange(start: number, length: number): T[];
}
