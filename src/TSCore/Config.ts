/// <reference path="Events/EventEmitter.ts" />

module TSCore {

    export class Config extends Events.EventEmitter {

        private _cache: any;
        private _data: any;

        public get(key: string) {

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

        public load(value: any): TSCore.Config {

            this._data = value;
            return this;
        }

        public has(key: string): boolean {

            return (this.get(key) !== null);
        }

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
