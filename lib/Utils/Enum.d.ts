export default class Enum {
    static names(e: any): string[];
    static values(e: any): number[];
    static object(e: any): {
        name: string;
        value: number;
    }[];
}
