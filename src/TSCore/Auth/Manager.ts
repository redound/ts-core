/// <reference path="../Events/EventEmitter.ts" />

module TSCore.Auth {

    export interface IIdentity {}

    export interface IAttemptError {
        message: string;
    }

    export interface ILoginAttemptError extends IAttemptError {}
    export interface ILogoutAttemptError extends IAttemptError {}

    export interface ILoginAttempt {
        (error: ILoginAttemptError, identity: IIdentity);
    }

    export interface ILogoutAttempt {
        (error?: ILogoutAttemptError);
    }

    export class Manager {

        protected _authMethods: TSCore.Data.Dictionary<any, Method> = new TSCore.Data.Dictionary<any, Method>();
        protected sessions: TSCore.Data.Dictionary<any, Session> = new TSCore.Data.Dictionary<any, Session>();
        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

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

            authMethod.login(credentials, (error: ILoginAttemptError, identity: IIdentity) => {

                if (error) {
                    this.events.trigger(TSCore.Auth.Manager.Events.LOGIN_ATTEMPT_FAIL, { credentials: credentials, method: method });
                    done(error, null);
                    return;
                }

                var session = this._setSessionForMethod(method, identity);


                this.events.trigger(TSCore.Auth.Manager.Events.LOGIN_ATTEMPT_SUCCESS, {
                    credentials: credentials,
                    method: method,
                    session: session
                });

                this.events.trigger(TSCore.Auth.Manager.Events.LOGIN, {
                    credentials: credentials,
                    method: method,
                    session: session
                });

                done(error, session);
            });
        }

        private _setSessionForMethod(method: any, identity: IIdentity): Session {

            var session = new Session();
            session.setIdentity(identity);
            this.sessions.set(method, session);
            return session;
        }

        public logout(method: any, done?: ILogoutAttempt) {

            var authMethod: Method = this._authMethods.get(method);

            if (!authMethod) {

                done({
                    message: 'AuthMethod does not exist'
                });
            }

            var session: Session = this.sessions.get(method);

            if (!session) {

                done({
                    message: 'Session does not exist'
                });
            }

            authMethod.logout(session, (error: ILogoutAttemptError) => {

                if (!error) {
                    this.sessions.remove(method);
                }

                this.events.trigger(TSCore.Auth.Manager.Events.LOGOUT, {
                    method: method
                });

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
         * Check whether any sessions have been set
         *
         * @returns {boolean}
         */
        public hasSessions(): boolean {
            return !this.sessions.isEmpty();
        }
    }

    export module Manager.Events {

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
}