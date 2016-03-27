/// <reference path="../typings/main.d.ts" />
import EventEmitter from "./Events/EventEmitter";
export default class Config extends EventEmitter {
    private _cache;
    private _data;
    /**
     * Load config by passing data to constructor (optional)
     *
     * @param data Any value to load config with.
     */
    constructor(data?: any);
    /**
     * Get (nested) value for key.
     * When no key is specified it returns
     * the full config.
     *
     * @param key   Key to return value for.
     * @returns {any}
     */
    get(key?: string): any;
    /**
     * Set (nested) value for key.
     *
     * @param key       Key optionally separated by a dot.
     * @param value     Value to set for given key.
     * @returns {Config}
     */
    set(key: string, value: any): this;
    /**
     * Load config with value.
     *
     * @param value Any value.
     * @returns {Config}
     */
    load(value: any): this;
    /**
     * Check if config has (nested) value for key.
     *
     * @param key Key to check for.
     * @returns {boolean}
     */
    has(key: string): boolean;
    /**
     * Clear the config or when passing a key the value of a that given key.
     *
     * @param key   Optional key to clear value of.
     * @returns {Config}
     */
    clear(key?: string): this;
}
