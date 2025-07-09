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
    info: (...messageArgs: LogMessage[]) => void;
    warn: (...messageArgs: LogMessage[]) => void;
    error: (...messageArgs: LogMessage[]) => void;
    singleError: (error: Error) => void;
    createLogMessage: (message: LogMessage, addPrefix?: boolean) => string;
};
type LoggerPrefix = boolean | ((name: string) => string);
type LoggerOptions = PrettyStringifyOptions;
type LogMessage = unknown;
/**
 * Formats the log level with a color.
 * @param level the log level
 * @returns the formatted log level
 */
declare function formatLogLevel(level: "info" | "warn" | "error"): string;
/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
declare function createLogger(name: string, options?: LoggerOptions): Logger;

export { type Logger, type LoggerOptions, type LoggerPrefix, createLogger, formatLogLevel };
