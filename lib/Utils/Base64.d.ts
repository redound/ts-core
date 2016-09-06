import BaseObject from "../BaseObject";
export default class Base64 extends BaseObject {
    private static keyStr;
    encode(input: any): string;
    decode(input: any): string;
}
