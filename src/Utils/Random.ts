import BaseObject from "../BaseObject";

export default class Random extends BaseObject {

    private static _uuidLut:string[];

    private static get uuidLut() {

        if (!Random._uuidLut) {

            var lut = [];
            for (var i = 0; i < 256; i++) {
                lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
            }

            Random._uuidLut = lut;
        }

        return Random._uuidLut;
    }


    public static number(min:number, max:number):number {

        return Math.floor((Math.random() * max) + min);
    }

    public static uniqueNumber():number {

        return parseInt(new Date().getTime() + '' + Random.number(0, 100));
    }

    public static bool():boolean {

        return Random.number(0, 1) == 1;
    }

    public static string(length:number = 10, characters:string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'):string {

        var result = '';
        for (var i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))];
        return result;
    }

    public static uuid():string {

        var lut = this.uuidLut;

        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;

        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }
}
