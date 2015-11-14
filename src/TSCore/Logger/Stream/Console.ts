/// <reference path="IStream.ts" />

module TSCore.Logger.Stream {

    export interface IConsole {
        log();
        info();
        warn();
        error();
    }

    export class Console extends TSCore.BaseObject implements TSCore.Logger.IStream {

        constructor(private _console: IConsole, public colorsEnabled: boolean = true) {
            super();
        }

        public exec(options: TSCore.Logger.ILogOptions) {

            var method;

            switch(options.level) {

                case TSCore.Logger.LogLevel.LOG:
                    method = 'log';
                    break;
                case TSCore.Logger.LogLevel.INFO:
                    method = 'info';
                    break;
                case TSCore.Logger.LogLevel.WARN:
                    method = 'warn';
                    break;
                case TSCore.Logger.LogLevel.ERROR:
                    method = 'error';
                    break;
            }

            var optionArgs = options.args || [];
            var args = [];

            if(this.colorsEnabled) {

                var tagBackgroundColor = this._generateHex(options.tag);
                var tagTextColor = this._getIdealTextColor(tagBackgroundColor);

                args = ['%c ' + options.tag + ' ', 'background: ' + tagBackgroundColor + '; color: ' + tagTextColor + ';'].concat(optionArgs);
            }
            else {

                args = [options.tag].concat(optionArgs);
            }

            this._console[method].apply(this._console, args);
        }

        protected _generateHex(input: string) {

            // str to hash
            for (var i = 0, hash = 0; i < input.length; hash = input.charCodeAt(i++) + ((hash << 5) - hash));

            // int/hash to hex
            for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

            return colour;
        }

        protected _getIdealTextColor(bgColor) {

            var r = bgColor.substring(1, 3);
            var g = bgColor.substring(3, 5);
            var b = bgColor.substring(5, 7);

            var components = {
                R: parseInt(r, 16),
                G: parseInt(g, 16),
                B: parseInt(b, 16)
            };

            var nThreshold = 105;
            var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

            return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
        }
    }
}