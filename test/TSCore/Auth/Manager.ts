/// <reference path="../TSCore.spec.ts" />

declare var describe, it, expect, jasmine, beforeEach;

describe("TSCore.Auth.Manager", () => {

   describe("addMethod()", () => {

       it("should add an auth method", () => {

           var authManager = new TSCore.Auth.Manager();

           authManager.addMethod('email', new TSCore.Auth.Method());

           console.log('authManager', authManager);
       });
   });
});