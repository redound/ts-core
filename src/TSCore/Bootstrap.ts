module TSCore {

    /**
     * @since 0.0.6
     * @author Olivier Andriessen <olivierandriessen@gmail.com>
     */
    export class Bootstrap {

        constructor() {

        }

        /**
         * Executes all methods on this class
         * starting with '_init'
         *
         * @returns {void}
         */
        public init(): void {

            for (var method in this) {

                if (TSCore.Text.Format.startsWith(method, "_init")) {
                    this[method]();
                }
            }
        }
    }
}