module TSCore.Utils {

    export class Random {

        public static number(min: number, max: number): number {

            return Math.floor((Math.random() * max) + min);
        }

        public static uniqueNumber(): number {

            return new Date().getTime() + '' + Random.number(0, 100);
        }

        public static bool(): boolean {

            return Random.number(0, 1) == 1;
        }

        public static string(length: number = 10, characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') : string {

            var result = '';
            for (var i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))];
            return result;
        }

        public static uuid(): string {

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
}