import chalk, { ChalkInstance } from "chalk";
import { PrettyStringifyOptions } from "../formatting/pretty-stringify";

export type Logger = {
  color?: ChalkInstance;
  info: (...args: LogMessage[]) => void;
  next: Logger["info"];
  warn: (...args: LogMessage[]) => void;
  error: (...args: LogMessage[]) => void;
  singleError: (error: Error) => void;
  createLogMessage: CreateLogMessageFn;
};

export type LoggerOptions = PrettyStringifyOptions & {
  printer?: (message: string) => void;
  prefix?: boolean | LogPrefixFn;
};

export type LogMessage = unknown;

export type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * A user-provided function option to format the prefix of the log message.
 *
 * @param name the logger name
 * @param level the log level
 * @returns the formatted prefix string
 */
export type LogPrefixFn = (loggerName: string, level: LogLevel) => string;

export type CreateLogMessageOptions = {
  level: LogLevel;
  addPrefix?: boolean | LogPrefixFn;
};

export type CreateLogMessageFn = (message: LogMessage, options: CreateLogMessageOptions) => string;

export const DefaultLogColors = {
  text: chalk.grey,
  prefixText: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red
};
