import EventEmitter from "./Events/EventEmitter";

export default class Config extends EventEmitter {

    private cache:any;
    private data:any;

    /**
     * Load config by passing data to constructor (optional)
     *
     * @param data Any value to load config with.
     */
    constructor(data?:any) {

        super();

        if (data) {
            this.load(data);
        }
    }

    /**
     * Get (nested) value for key.
     * When no key is specified it returns
     * the full config.
     *
     * @param key   Key to return value for.
     * @returns {any}
     */
    public get(key?:string):any {

        this.data = this.data || {};
        this.cache = this.cache || {};

        if (!key) {
            return this.data;
        }

        if (this.cache[key]) {
            return this.cache[key];
        }

        var segs = key.split('.');
        var root = this.data;

        for (var i = 0; i < segs.length; i++) {

            var part = segs[i];

            if (root[part] !== void 0) {
                root = root[part];
            } else {
                root = null;
                break;
            }
        }

        return this.cache[key] = root;
    }

    /**
     * Set (nested) value for key.
     *
     * @param key       Key optionally separated by a dot.
     * @param value     Value to set for given key.
     * @returns {Config}
     */
    public set(key:string, value:any):this {

        this.cache = this.cache || {};
        this.data = this.data || {};

        var segs = key.split('.');

        var root = this.data;

        for (var i = 0; i < segs.length; i++) {

            var part = segs[i];

            if (root[part] === void 0 && i !== segs.length - 1) {
                root[part] = {};
            }

            root = root[part];
        }

        this.cache[key] = root = value;

        return this;
    }

    /**
     * Load config with value.
     *
     * @param value Any value.
     * @returns {Config}
     */
    public load(value:any):this {

        this.data = value;
        return this;
    }

    /**
     * Check if config has (nested) value for key.
     *
     * @param key Key to check for.
     * @returns {boolean}
     */
    public has(key:string):boolean {

        return (this.get(key) !== null);
    }

    /**
     * Clear the config or when passing a key the value of a that given key.
     *
     * @param key   Optional key to clear value of.
     * @returns {Config}
     */
    public clear(key?:string):this {

        if (key) {

            this.cache = this.cache || {};
            this.data = this.data || {};

            if (!this.has(key)) {
                return this;
            }

            // Clear from cache
            delete this.cache[key];

            var segs = key.split('.');
            var root = this.data;

            for (var i = 0; i < segs.length; i++) {

                var part = segs[i];

                if (!root[part]) {
                    break;
                }

                if (i === segs.length - 1) {
                    delete root[part];
                }

                root = root[part];
            }

            return this;
        }

        this.cache = {};
        this.data = {};

        return this;
    }
}
