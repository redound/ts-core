import BaseObject from "../BaseObject";
export default class Text extends BaseObject {
    private static HtmlEntityMap;
    static escapeHtml(input: string): string;
    static truncate(input: string, maxLength: number, suffix?: string): string;
    static concatenate(parts: any[], seperator?: string, lastSeparator?: string): string;
    static zeroPad(input: string, width: number, zero?: string): string;
    static ucFirst(input: string): string;
    static startsWith(source: string, search: string): boolean;
    static endsWith(source: string, search: string): boolean;
}
