module TSCore.Auth {

    export class AuthMethod {

        public name: string;

        /**
         * Authenticate user
         * @param credentials
         * @param done
         */
        public login(credentials: any, done: IAuthAttempt): void {

            if (false) {

                done(null, new Session());
            } else {

                done({ message: 'Failed to authenticate' }, null);
            }
        }
    }
}