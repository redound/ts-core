module TSCore.Auth {

    export interface IUserEmail {
        value: string;
        type: string;
    }

    export interface IUserName {
        familyName: string;
        givenName: string;
        middleName: string;
    }

    export interface IUser {
        provider: string;
        id: number;
        displayName: IUserName;
        emails: IUserEmail[];
    }

    export class Session {

        constructor(protected _method?: string, protected _user?: IUser) {

        }

        /**
         * Get the authenticated user.
         * @returns {IUser}
         */
        getUser(): IUser {

            return this._user;
        }

        /**
         * Set the authenticated user.
         *
         * @param user User profile.
         * @returns {TSCore.Auth.Session}
         */
        setUser(user: IUser): TSCore.Auth.Session {

            this._user = user;

            return this;
        }

        /**
         * Which method was used to create this
         * session.
         *
         * @returns {string}
         */
        getMethod(): string {

            return this._method;
        }

        /**
         * Set the method that was used to create
         * this session.
         *
         * @returns {TSCore.Auth.Session}
         */
        setMethod(method: string): TSCore.Auth.Session {

            this._method = method;

            return this;
        }
    }
}