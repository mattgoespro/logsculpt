import chalk, { ChalkInstance } from "chalk";
import { PrettyStringifyOptions } from "../formatting/pretty-stringify";

export type LogMessage = unknown;

export type CreateLogMessageOptions = {
  level: LogLevel;
  addPrefix?: boolean | LogPrefixFn | undefined;
};

export type CreateLogMessageFn = (message: LogMessage, options: CreateLogMessageOptions) => string;

export type Logger = {
  color?: ChalkInstance;
  info: (...messageArgs: LogMessage[]) => void;
  next: Logger["info"];
  warn: (...messageArgs: LogMessage[]) => void;
  error: (...messageArgs: LogMessage[]) => void;
  singleError: (error: Error) => void;
  createLogMessage: CreateLogMessageFn;
};

export const DefaultLogColors = {
  text: chalk.grey,
  prefixText: chalk.green,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red
};

export type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * A user-provided function option to format the prefix of the log message.
 * @param name the logger name
 * @param level the log level
 * @returns the formatted prefix string
 */
export type LogPrefixFn = (loggerName: string, level: LogLevel) => string;
export type LoggerOptions = PrettyStringifyOptions & {
  stdout?: NodeJS.WriteStream;
  prefix?: boolean | LogPrefixFn;
};
