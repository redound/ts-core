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

    export interface IAttemptError {
        message: string;
    }

    export interface ILoginAttemptError extends IAttemptError {}
    export interface ILogoutAttemptError extends IAttemptError {}

    export interface ILoginAttempt {
        (error: ILoginAttemptError, session: Session);
    }

    export interface ILogoutAttempt {
        (error?: ILogoutAttemptError);
    }

    export class Manager {

        protected _authMethods: TSCore.Data.Dictionary<any, Method> = new TSCore.Data.Dictionary<any, Method>();
        protected _session: Session;
        public events: TSCore.Events.EventEmitter;

        constructor() {
            this.events = new TSCore.Events.EventEmitter;
        }

        /**
         * Try to authenticate a user.
         * @param method            Which method to use.
         * @param credentials       Object containing the required credentials.
         * @param done              Callback that will be called when authentication attempt has completed.
         */
        public login(method: any, credentials: {}, done?: ILoginAttempt) {

            var authMethod:Method = this._authMethods.get(method);

            if (!authMethod) {
                done({ message: 'AuthMethod does not exist' }, null);
            }

            authMethod.login(credentials, (error: ILoginAttemptError, session: Session) => {

                /**
                 * Handle error with events then callback
                 */
                if (error) {
                    this.events.trigger(ManagerEvents.LOGIN_ATTEMPT_FAIL, { credentials: credentials, method: method });
                    done(error, null);
                    return;
                }

                /**
                 * Set Session
                 */
                this._session = session;

                /**
                 * Trigger login events
                 */
                this.events.trigger(ManagerEvents.LOGIN_ATTEMPT_SUCCESS, { credentials: credentials, method: method, session: session });
                this.events.trigger(ManagerEvents.LOGIN, { credentials: credentials, method: method, session: session });

                /**
                 * Callback
                 */
                done(error, session);
            });
        }

        public logout(method: any, done?: ILogoutAttempt) {

            var authMethod:Method = this._authMethods.get(method);

            if (!authMethod) {
                done({ message: 'AuthMethod does not exist' });
            }

            authMethod.logout(this._session, (error: ILogoutAttemptError) => {

                if (!error) {
                    this._session = null;
                }

                if (done) {
                    done(error);
                }
            });
        }

        /**
         * Add an authentication method to the manager.
         *
         * @param method        Name of the method.
         * @param authMethod    AuthMethod instance.
         * @returns {TSCore.Auth.Manager}
         */
        public addMethod(method: any, authMethod: Method): TSCore.Auth.Manager {

            this._authMethods.set(method, authMethod);

            return this;
        }

        /**
         * Remove an authentication method from the manager.
         *
         * @param method        Name of the method.
         * @returns {TSCore.Auth.Manager}
         */
        public removeMethod(method: any): TSCore.Auth.Manager {

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
    }
}