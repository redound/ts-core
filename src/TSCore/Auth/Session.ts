module TSCore.Auth {

    export class Session {

        constructor(protected _method?: string, protected _identity?: IIdentity) {

        }

        /**
         * Get the authenticated identity.
         *
         * @returns {{}}
         */
        getIdentity(): {} {

            return this._identity;
        }

        /**
         * Set the authenticated identity.
         *
         * @param identity
         * @returns {TSCore.Auth.Session}
         */
        setIdentity(identity: IIdentity): TSCore.Auth.Session {

            this._identity = identity;

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