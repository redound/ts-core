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

        public static escapeHtml(input:string):string {

            var entityMap = Format.HtmlEntityMap;

            return String(input).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }

        public static truncate(input:string, maxLength:number, suffix:string = '...'):string {

            if (input.length <= length) {
                return input;
            }

            return input.substring(0, length) + suffix;
        }

        public static concatenate(parts:any[], seperator:string = ', ', lastSeparator:string = seperator):string {

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

        public static zeroPad(input:string, width:number, zero:string = '0'):string {

            return input.length >= width ? input : new Array(width - input.length + 1).join(zero) + input;
        }

        public static ucFirst(input:string):string {

            if (input == '') {
                return input;
            }

            return input.charAt(0).toUpperCase() + input.slice(1);
        }
    }
}