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
/**
 * Formats the provided log level string by applying the appropriate color logging style.
 *
 * @param {LogLevel} level the log level
 *
 * @returns {string} the colored log level string
 */
declare function colorizeLogLevel(level: LogLevel): string;

export { PrefixNameLogPreset, colorizeLogLevel, createLogger };
