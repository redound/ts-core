/// <reference path="../../typings/main.d.ts" />
import BaseObject from "../BaseObject";
export default class Text extends BaseObject {
    private static HtmlEntityMap;
    /**
     * Escape a html string.
     *
     * @param input String to be parsed.
     * @returns {string}
     */
    static escapeHtml(input: string): string;
    /**
     * Truncate strings length with a suffix for a given length.
     *
     * @param input             String to be truncated.
     * @param maxLength         Length of the truncated string.
     * @param suffix            Suffix to be added at the end of a string. Defaults to '...'.
     * @returns {string}
     */
    static truncate(input: string, maxLength: number, suffix?: string): string;
    /**
     * Concatenate parts together.
     *
     * @param parts             Parts that get concatenated.
     * @param seperator         Separator value that by which the parts get concatenated.
     * @param lastSeparator     Last separator to concatenate parts with. Defaults to separator.
     * @returns {string}
     */
    static concatenate(parts: any[], seperator?: string, lastSeparator?: string): string;
    /**
     * Zero pad a string.
     * TODO: What if input.length is greater than width?
     *
     * @param input     String to be padded.
     * @param width     Total length of the string after being padded.
     * @param zero      String to pad input with. Defaults to "0".
     * @returns {string}
     */
    static zeroPad(input: string, width: number, zero?: string): string;
    /**
     * Make a string's first character uppercase.
     *
     * @param input String to be parsed.
     * @returns {string}
     */
    static ucFirst(input: string): string;
    /**
     * Check if string starts with a certain string.
     *
     * @param source    Source string.
     * @param search    String to search for.
     * @returns {boolean}
     */
    static startsWith(source: string, search: string): boolean;
    /**
     * Check if string ends with a certain string.
     *
     * @param source    Source string.
     * @param search    String to search for.
     * @returns {boolean}
     */
    static endsWith(source: string, search: string): boolean;
}
