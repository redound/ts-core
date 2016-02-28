///<reference path="ICollectionOperation.ts"/>

module TSCore.Data {

    export module CollectionEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const REPLACE:string = "replace";
        export const CLEAR:string = "clear";

        export interface IChangeParams<T> {}
        export interface IClearParams<T> {}

        export interface IAddParams<T> {
            operations: ICollectionOperation<T>[]
        }

        export interface IRemoveParams<T> {
            operations: ICollectionOperation<T>[],
            clear: boolean
        }

        export interface IReplaceParams<T> {
            source: T,
            replacement: T
        }
    }
}