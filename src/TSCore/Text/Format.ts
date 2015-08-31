module TSCore.Text {

    export class Format {

        private static HtmlEntityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        /**
         * Escape a html string.
         *
         * @param input String to be parsed.
         * @returns {string}
         */
        public static escapeHtml(input:string):string {

            var entityMap = Format.HtmlEntityMap;

            return String(input).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }

        /**
         * Truncate strings length with a suffix for a given length.
         *
         * @param input             String to be truncated.
         * @param maxLength         Length of the truncated string.
         * @param suffix            Suffix to be added at the end of a string. Defaults to '...'.
         * @returns {string}
         */
        public static truncate(input:string, maxLength:number, suffix:string = '...'):string {

            if (input.length <= length) {
                return input;
            }

            return input.substring(0, length) + suffix;
        }

        /**
         * Concatenate parts together.
         *
         * @param parts             Parts that get concatenated.
         * @param seperator         Separator value that by which the parts get concatenated.
         * @param lastSeparator     Last separator to concatenate parts with. Defaults to separator.
         * @returns {string}
         */
        public static concatenate(parts: any[], seperator: string = ', ', lastSeparator: string = seperator): string {

            var result = '';

            _.each(parts, function (part, index) {

                if (index > 0) {

                    if (index == parts.length - 1) {
                        result += lastSeparator;
                    }
                    else {
                        result += seperator;
                    }
                }

                result += part;
            });

            return result;
        }

        /**
         * Zero pad a string.
         * TODO: What if input.length is greater than width?
         *
         * @param input     String to be padded.
         * @param width     Total length of the string after being padded.
         * @param zero      String to pad input with. Defaults to "0".
         * @returns {string}
         */
        public static zeroPad(input:string, width:number, zero:string = '0'):string {

            return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
        }

        /**
         * Make a string's first character uppercase.
         *
         * @param input String to be parsed.
         * @returns {string}
         */
        public static ucFirst(input:string):string {

            if (input == '') {
                return input;
            }

            return input.charAt(0).toUpperCase() + input.slice(1);
        }

        /**
         * Check if string starts with a certain string.
         *
         * @param input     String to check for.
         * @returns {boolean}
         */
        public static startsWith(source: String, search: String): boolean {

            return source.slice(0, search.length) == search;
        }

        /**
         * Check if string ends with a certain string.
         *
         * @param input     String to check for.
         * @returns {boolean}
         */
        public static endsWith(source: String, search: String): boolean {

            return source.slice(-search.length) == search;
        }
    }
}