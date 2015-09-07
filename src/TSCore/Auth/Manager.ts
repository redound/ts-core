/// <reference path="../Events/EventEmitter.ts" />

module TSCore.Auth {

    export module ManagerEvents {

        export const LOGIN_ATTEMPT_FAIL: string = "login-attempt-fail";
        export const LOGIN_ATTEMPT_SUCCESS: string = "login-attempt-success";
        export const LOGIN: string = "login";
        export const LOGOUT: string = "logout";

        export interface ILoginAttemptFailParams<T> {
            credentials: T,
            method: string
        }

        export interface ILoginAttemptSuccessParams<T> {
            credentials: T,
            method: string,
            session: Session
        }

        export interface ILoginParams<T> {
            method: string,
            session: Session
        }

        export interface ILogoutParams<T> {
            method: string
        }
    }

    export interface ILoginAttemptError {
        message: string;
    }

    export interface ILoginAttempt {
        (error: ILoginAttemptError, session: Session);
    }

    export class Manager {

        protected _authMethods: TSCore.Data.Dictionary<string, Method>;
        protected _session: Session;
        public events: TSCore.Events.EventEmitter;

        constructor() {
            this._authMethods = new TSCore.Data.Dictionary<string, Method>();
            this.events = new TSCore.Events.EventEmitter;
        }

        /**
         * Try to authenticate a user.
         * @param method            Which method to use.
         * @param credentials       Object containing the required credentials.
         * @param done              Callback that will be called when authentication attempt has completed.
         */
        public login(method: string, credentials: {}, done?: ILoginAttempt) {

            var authMethod:Method = this._authMethods.get(method);

            if (!authMethod) {
                done({ message: 'AuthMethod does not exist' }, null);
            }

            authMethod.login(credentials, (error: ILoginAttemptError, session: Session) => {

                if (error) {
                    this.events.trigger(ManagerEvents.LOGIN_ATTEMPT_FAIL, { credentials: credentials, method: method });
                    return done(error, null);
                }

                this.events.trigger(ManagerEvents.LOGIN_ATTEMPT_SUCCESS, { credentials: credentials, method: method, session: session });
                this.events.trigger(ManagerEvents.LOGIN, { credentials: credentials, method: method, session: session });
                done(error, session);
            });
        }

        /**
         * Add an authentication method to the manager.
         *
         * @param method        Name of the method.
         * @param authMethod    AuthMethod instance.
         * @returns {TSCore.Auth.Manager}
         */
        public addMethod(method: string, authMethod: Method): TSCore.Auth.Manager {

            this._authMethods.set(method, authMethod);

            return this;
        }

        /**
         * Remove an authentication method from the manager.
         *
         * @param method        Name of the method.
         * @returns {TSCore.Auth.Manager}
         */
        public removeMethod(method: string): TSCore.Auth.Manager {

            this._authMethods.remove(method);

            return this;
        }

        /**
         * Determine if the current user is authenticated.
         *
         * @returns {boolean}
         */
        public check(): boolean {
            return !!this._session;
        }

        /**
         * Get session of authenticated user.
         *
         * @returns {boolean}
         */
        public getSession(): Session {
            return this._session;
        }

        /**
         * Check if the session is created by
         * the method name provided.
         *
         * @param method    Name of authentication method.
         */
        public isSession(method: string): boolean {

            var session = this.getSession();

            if (!session) {
                return false;
            }

            return (session.getMethod() === method);
        }
    }
}