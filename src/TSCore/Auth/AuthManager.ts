/// <reference path="../Events/EventEmitter.ts" />

module TSCore.Auth {

    module AuthEvents {

        export const ATTEMPT_FAIL: string = "attempt-fail";
        export const ATTEMPT_SUCCESS: string = "attempt-success";
        export const LOGIN: string = "login";
        export const LOGOUT: string = "logout";

        export interface IAttemptFailParams<T> {
            credentials: T,
            method: string
        }

        export interface IAttemptSuccessParams<T> {
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

    export interface IAuthAttemptError {
        message: string;
    }

    export interface IAuthAttempt {
        (error: IAuthAttemptError, session: Session);
    }

    export class AuthManager extends TSCore.Events.EventEmitter {

        protected _authMethods: TSCore.Data.Dictionary<string, AuthMethod>;
        protected _session: Session;

        constructor() {

            super();
        }

        /**
         * Try to authenticate a user.
         * @param method            Which method to use.
         * @param credentials       Object containing the required credentials.
         * @param done              Callback that will be called when authentication attempt has completed.
         */
        public login(method: string, credentials: {}, done: IAuthAttempt) {

            var authMethod:AuthMethod = this._authMethods.get(method);

            if (!authMethod) {
                done({ message: 'AuthMethod does not exist' }, null);
            }

            authMethod.login(credentials, (error: IAuthAttemptError, session: Session) => {

                if (error) {
                    this.trigger(AuthEvents.ATTEMPT_FAIL, { credentials: credentials, method: method });
                    return done(error, null);
                }

                this.trigger(AuthEvents.ATTEMPT_SUCCESS, { credentials: credentials, method: method, session: session });
                this.trigger(AuthEvents.LOGIN, { credentials: credentials, method: method, session: session });
                done(error, session);
            });
        }

        /**
         * Add an authentication method to the manager.
         *
         * @param method        Name of the method.
         * @param authMethod    AuthMethod instance.
         * @returns {TSCore.Auth.AuthManager}
         */
        public setMethod(method: string, authMethod: AuthMethod): TSCore.Auth.AuthManager {

            this._authMethods.set(method, authMethod);

            return this;
        }

        /**
         * Remove an authentication method from the manager.
         *
         * @param method        Name of the method.
         * @returns {TSCore.Auth.AuthManager}
         */
        public removeMethod(method: string): TSCore.Auth.AuthManager {

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