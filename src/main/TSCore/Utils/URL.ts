/// <reference path="../../tscore.d.ts" />

module TSCore.Utils {

    export class URL {

        private _absoluteString: string;
        private _absoluteUrl: string;
        private _basePath: string;
        private _fragment: string;
        private _lastPathComponent: string;
        private _parameterString: string;
        private _password: string;
        private _path: string;
        private _pathComponents: string;
        private _pathExtension: string;
        private _port: number;
        private _query: string;
        private _relativePath: string;
        private _relativeString: string;
        private _resourceSpecifier: string;
        private _scheme: string;
        private _standardizedUrl: string;
        private _user: string;

        constructor(path) {

            this._path = path;
        }

        get path() {

            return this._path;
        }

        get host() {

            return "www.example.com";
        }

        get basePath() {

            return "http://www.example.com/";
        }

        get relativePath() {

            return "home/index";
        }
    }
}