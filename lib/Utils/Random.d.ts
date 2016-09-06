import BaseObject from "../BaseObject";
export default class Random extends BaseObject {
    private static _uuidLut;
    private static uuidLut;
    static number(min: number, max: number): number;
    static uniqueNumber(): number;
    static bool(): boolean;
    static string(length?: number, characters?: string): string;
    static uuid(): string;
}
