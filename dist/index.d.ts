declare module "formatting/chalk" { }
declare module "formatting/text-formatting" {
    /**
     * Centers each line of text bounded by a specified width.
     *
     * @param lines - A single string or an array of strings representing the lines of text to be centered.
     * @param width - The maximum width within which to center the text. If not provided, the width of the longest line is used.
     * @returns An array of strings where each string is a centered line of text.
     */
    export function centerTextLines(lines: string | string[], width?: number): string[];
    /**
     * Creates a nested box structure with the given content boxes.
     *
     * @param boxes - An array of content boxes, where each box has a title and contents.
     * @returns A formatted string that nests the content boxes within each other.
     */
    export function nestContentBoxes(...boxes: {
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
    export function prettyStringify(value: unknown, options?: FormatJsonOptions | undefined, indent?: number): string;
}
declare module "logging/logger" {
    import "formatting/chalk";
    export type Logger = {
        info: (...messageArgs: LogMessage[]) => void;
        warn: (...messageArgs: LogMessage[]) => void;
        error: (...messageArgs: LogMessage[]) => void;
        singleError: (error: Error) => void;
        createLogMessage: (message: LogMessage, addPrefix?: boolean) => string;
    };
    type LogMessage = unknown;
    /**
     * Returns a function that logs messages of different levels prefixed with the logger name.
     *
     * @param name the log message prefix
     */
    export function createLogger(name: string): Logger;
}
declare module "index" {
    export * from "logging/logger";
}
declare module "errors/formatted-error" {
    type FormattedErrorOptions<T = undefined> = T extends undefined ? ErrorOptions : ErrorOptions & T;
    /**
     * Create a formatted error, surrounded by a box with a title and custom options that are used to
     * format the main error message.
     */
    export abstract class FormattedError<O = undefined> extends Error {
        options?: FormattedErrorOptions<O>;
        cause?: Error;
        constructor(message: string, options?: FormattedErrorOptions<O>);
        /**
         * Determines whether the given error is an instance of FormattedError.
         *
         * @param error the error to check
         * @returns true if the error is an instance of FormattedError, otherwise false.
         */
        static isInstance<T extends Record<string, unknown>>(error: unknown): error is FormattedError<T>;
        /**
         * Format the message that is displayed inside the outermost border-box given the error message and options.
         *
         * This method must be overridden by subclasses if this class is extended.
         *
         * @param message the main message passed to the error
         * @param options additional options passed to the error
         * @returns the formatted error message
         */
        protected abstract getErrorMessage(message: string, options: FormattedErrorOptions<O>): string;
        private _formatMessage;
    }
}
