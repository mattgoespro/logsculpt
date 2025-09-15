import { ChalkInstance } from 'chalk';

/**
 * Options for formatting JSON objects.
 *
 * @property prefix - Whether to include a prefix for each line of the formatted string.
 * @property indent - The initial indentation level for the formatted string.
 * @property objectKeyModifier - A function that modifies object keys before formatting.
 * @property objectValueModifier - A function that modifies object values before formatting.
 * @property sortObjectKeys - Whether to sort object keys before formatting.
 * @property quoteStrings - Whether to quote string values in the formatted string.
 */
type PrettyStringifyOptions = {
    prefix?: boolean | PrettyStringifyPrefixFn;
    indent?: number;
    objectKeyModifier?: (key: string) => string;
    objectValueModifier?: (value: unknown) => string;
    sortObjectKeys?: boolean;
    quoteStrings?: boolean;
};
type PrettyStringifyPrefixFn = (name: string) => string;

type Logger = {
    color?: ChalkInstance;
    info: (...args: LogMessage[]) => void;
    next: Logger["info"];
    warn: (...args: LogMessage[]) => void;
    error: (...args: LogMessage[]) => void;
    singleError: (error: Error) => void;
    createLogMessage: CreateLogMessageFn;
};
type LoggerOptions = PrettyStringifyOptions & {
    printer?: (message: string) => void;
    prefix?: boolean | LogPrefixFn;
};
type LogMessage = unknown;
type LogLevel = "info" | "warn" | "error" | "debug";
/**
 * A user-provided function option to format the prefix of the log message.
 *
 * @param name the logger name
 * @param level the log level
 * @returns the formatted prefix string
 */
type LogPrefixFn = (loggerName: string, level: LogLevel) => string;
type CreateLogMessageOptions = {
    level: LogLevel;
    addPrefix?: boolean | LogPrefixFn;
};
type CreateLogMessageFn = (message: LogMessage, options: CreateLogMessageOptions) => string;

/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
declare function createLogger(name: string, options?: LoggerOptions): Logger;
declare const PrefixNameLogPreset: LogPrefixFn;

type FormattedErrorOptions<T = undefined> = T extends undefined ? ErrorOptions : ErrorOptions & T;
/**
 * Create a formatted error, surrounded by a box with a title and custom options that are used to
 * format the main error message.
 */
declare abstract class FormattedError<O = undefined> extends Error {
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

export { FormattedError, type Logger, type LoggerOptions, PrefixNameLogPreset, createLogger };
