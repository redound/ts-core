module TSCore.Auth {

    export class Method {

        static name: string;
        
        /**
         * Authenticate user
         * @param credentials
         * @param done
         */
        public login(credentials: any, done: ILoginAttempt): void {

        }

        public logout(session: TSCore.Auth.Session, done: ILogoutAttempt): void {

        }
    }
}