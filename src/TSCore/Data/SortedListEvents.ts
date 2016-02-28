///<reference path="ISortedListOperation.ts"/>

module TSCore.Data {

    export module SortedListEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const REPLACE:string = "replace";
        export const CLEAR:string = "clear";
        export const SORT:string = "sort";

        export interface IChangeParams<T> {}
        export interface IClearParams<T> {}
        export interface ISortParams<T> {}

        export interface IAddParams<T> {
            operations: ISortedListOperation<T>[]
        }

        export interface IRemoveParams<T> {
            operations: ISortedListOperation<T>[],
            clear: boolean
        }

        export interface IReplaceParams<T> {
            source: T,
            replacement: T
        }
    }
}