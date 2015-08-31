/// <reference path="../TSCore.spec.ts" />

declare var jasmine;

module Mocks {

    export class Bootstrap extends TSCore.Bootstrap {

        public configSpy: any;
        public loggerSpy: any;
        public authManagerSpy: any;

        constructor() {

            super();

            this.configSpy = jasmine.createSpy();
            this.loggerSpy = jasmine.createSpy();
            this.authManagerSpy = jasmine.createSpy();
        }

        public _initConfig() {

            this.configSpy();
        }

        public _initLogger() {

            this.loggerSpy();
        }

        public _initAuthManager() {

            this.authManagerSpy();
        }

    }
}