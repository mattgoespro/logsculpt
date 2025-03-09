/**
 * Centers each line of text bounded by a specified width.
 *
 * @param lines - A single string or an array of strings representing the lines of text to be centered.
 * @param width - The maximum width within which to center the text. If not provided, the width of the longest line is used.
 * @returns An array of strings where each string is a centered line of text.
 */
export declare function centerTextLines(lines: string | string[], width?: number): string[];
/**
 * Creates a nested box structure with the given content boxes.
 *
 * @param boxes - An array of content boxes, where each box has a title and contents.
 * @returns A formatted string that nests the content boxes within each other.
 */
export declare function nestContentBoxes(...boxes: {
    title: string;
    contents: string;
}[]): string;
/**
 * Options for formatting JSON objects.
 *
 * @property { (key: string) => string } [objectKeyModifier] - A callback function that formats object keys.
 * @property { (value: unknown) => string } [objectValueModifier] - A callback function that formats object values.
 * @property { boolean } [sortObjectKeys] - Whether to sort object keys.
 * @property { boolean } [quoteStrings] - Whether to quote string values.
 */
type FormatJsonOptions = {
    objectKeyModifier?: (key: string) => string;
    objectValueModifier?: (value: unknown) => string;
    sortObjectKeys?: boolean;
    quoteStrings?: boolean;
};
/**
 * Converts a given value to a pretty-printed string representation.
 *
 * @param value - The value to be pretty-printed. Can be of any type.
 * @param options - Optional formatting options for JSON strings.
 * @param indent - The number of spaces to use for indentation. Default is 0.
 * @returns The pretty-printed string representation of the value.
 * @throws Will throw an error if the value type is unsupported.
 */
export declare function prettyStringify(value: unknown, options?: FormatJsonOptions | undefined, indent?: number): string;
export {};
