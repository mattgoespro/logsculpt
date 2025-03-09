import "./chalk";
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
export declare function createLogger(name: string): Logger;
export {};
