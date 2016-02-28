///<reference path="IListOperation.ts"/>

module TSCore.Data {

    export module ListEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const REPLACE:string = "replace";
        export const CLEAR:string = "clear";

        export interface IChangeParams<T> {}
        export interface IClearParams<T> {}

        export interface IAddParams<T> {
            operations: IListOperation<T>[],
            clear: boolean
        }

        export interface IRemoveParams<T> {
            operations: IListOperation<T>[]
        }

        export interface IReplaceParams<T> {
            source: T,
            replacement: T
        }
    }
}