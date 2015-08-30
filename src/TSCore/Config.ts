/// <reference path="Events/EventEmitter.ts" />

module TSCore {

    export class Config extends Events.EventEmitter {

        private _cache: any;
        private _data: any;

        /**
         * Load config by passing data to constructor (optional)
         *
         * @param data Any value to load config with.
         */
        constructor(data?: any) {

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
        public get(key?: string): any {

            this._data = this._data || {};
            this._cache = this._cache || {};

            if (!key) {
                return this._data;
            }

            if (this._cache[key]) {
                return this._cache[key];
            }

            var segs = key.split('.');
            var root = this._data;

            for (var i = 0; i < segs.length; i++) {

                var part = segs[i];

                if (root[part] !== void 0) {
                    root = root[part];
                } else {
                    root = null;
                    break;
                }
            }

            return this._cache[key] = root;
        }

        /**
         * Set (nested) value for key.
         *
         * @param key       Key optionally separated by a dot.
         * @param value     Value to set for given key.
         * @returns {TSCore.Config}
         */
        public set(key: string, value: any): TSCore.Config {

            this._cache = this._cache || {};
            this._data = this._data || {};

            var segs = key.split('.');

            var root = this._data;

            for (var i = 0; i < segs.length; i++) {

                var part = segs[i];

                if (root[part] === void 0 && i !== segs.length - 1) {
                    root[part] = {};
                }

                root = root[part];
            }

            this._cache[key] = root = value;

            return this;
        }

        /**
         * Load config with value.
         *
         * @param value Any value.
         * @returns {TSCore.Config}
         */
        public load(value: any): TSCore.Config {

            this._data = value;
            return this;
        }

        /**
         * Check if config has (nested) value for key.
         *
         * @param key Key to check for.
         * @returns {boolean}
         */
        public has(key: string): boolean {

            return (this.get(key) !== null);
        }

        /**
         * Clear the config or when passing a key the value of a that given key.
         *
         * @param key   Optional key to clear value of.
         * @returns {TSCore.Config}
         */
        public clear(key?: string): TSCore.Config {

            if (key) {

                this._cache = this._cache || {};
                this._data = this._data || {};

                if (!this.has(key)) {
                    return this;
                }

                // Clear from cache
                delete this._cache[key];

                var segs = key.split('.');
                var root = this._data;

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

            this._cache = {};
            this._data = {};

            return this;
        }
    }
} 
