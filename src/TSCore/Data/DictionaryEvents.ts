module TSCore.Data {

    export module DictionaryEvents {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const CLEAR:string = "clear";

        export interface IChangeParams {}
        export interface IClearParams {}

        export interface IAddParams<K, V> {
            key: K,
            value: V
        }

        export interface IRemoveParams<K, V> {
            key: K,
            value: V
        }
    }
}