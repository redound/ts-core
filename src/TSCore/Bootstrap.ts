module TSCore {

    /**
     * @since 0.0.6
     * @author Olivier Andriessen <olivierandriessen@gmail.com>
     */
    export class Bootstrap {

        /**
         * Executes all methods on this class
         * starting with '_init'
         *
         * @returns {void}
         */
        public init(): void {

            for (var method in this) {

                if (TSCore.Utils.String.startsWith(method, "_init")) {
                    this[method]();
                }
            }
        }
    }
}