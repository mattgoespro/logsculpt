import chalk from "chalk";
import "../formatting/chalk";
import {
  CreateLogMessageFn,
  CreateLogMessageOptions,
  DefaultLogColors,
  Logger,
  LoggerOptions,
  LogLevel,
  LogMessage,
  LogPrefixFn
} from "./model";
import { prettyStringify } from "../formatting/pretty-stringify";

/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
export function createLogger(name: string, options?: LoggerOptions): Logger {
  const prefix = options?.prefix ?? true;
  const print = options?.printer ?? console.log;

  const createLogMessage: CreateLogMessageFn = (
    message: LogMessage,
    createOptions: CreateLogMessageOptions
  ) => {
    return prettyStringify(message, options)
      .split("\n")
      .map(
        (line) =>
          `${stringifyPrefixWithLevel(name, createOptions.level, prefix)}${isAnsiColoredMessage(line) ? line : DefaultLogColors.text(line)}`
      )
      .join("\n");
  };

  const logInfo = (...messageArgs: LogMessage[]) => {
    /**
     * A message has multiple lines if at least one of the message arguments is a string that contains an escaped line break.
     * In this case, split the message into lines and log each line separately.
     */
    const messageLines = messageArgs.flatMap((message) =>
      typeof message === "string" ? message.split("\n") : message
    );

    if (isMessageNewlineEscaped(messageArgs)) {
      for (const messageLine of messageLines) {
        print(createLogMessage(messageLine, { level: "info", addPrefix: prefix }));
      }
      return;
    }

    print(
      messageArgs
        .map((arg) => createLogMessage(arg, { level: "info", addPrefix: prefix }))
        .join(" ")
    );
  };

  const logger: Logger = {
    info: logInfo,
    next: logInfo,
    warn: (...messageArgs: LogMessage[]) =>
      print(
        `${messageArgs.map((arg) => createLogMessage(arg, { level: "warn", addPrefix: prefix })).join(" ")}`
      ),
    error: (...messageArgs: LogMessage[]) =>
      print(
        `${messageArgs.map((arg) => createLogMessage(arg, { level: "error", addPrefix: prefix })).join(" ")}`
      ),
    singleError: (error: Error) => {
      print(`${stringifyPrefixWithLevel(name, "error", prefix)}${error.message}`);

      if (error.stack != null) {
        print(
          error.stack
            .split("\n")
            .map((line) => `${stringifyPrefixWithLevel(name, "error", prefix)}${line}`)
            .join("\n")
        );
      }
    },
    createLogMessage
  };

  return logger;
}

export const PrefixNameLogPreset: LogPrefixFn = (name, level) =>
  `[${DefaultLogColors.prefixText(name)}] ${colorizeLogLevel(level)}: `;

/**
 * Formats the provided log level string by applying the appropriate color logging style.
 *
 * @param {LogLevel} level the log level
 *
 * @returns {string} the colored log level string
 */
export function colorizeLogLevel(level: LogLevel): string {
  let style = chalk.bold;

  switch (level) {
    case "info":
      style = DefaultLogColors.info;
      break;
    case "warn":
      style = DefaultLogColors.warn;
      break;
    case "error":
      style = DefaultLogColors.error;
      break;
  }

  return style(level);
}

/**
 * Returns a string representation of the log prefix with the log level.
 *
 * @param {string} name the logger name
 * @param {LogLevel} level the log level
 * @param {boolean | LogPrefixFn} prefix the prefix option
 *
 * @returns {string} the formatted log prefix
 */
function stringifyPrefixWithLevel(
  name: string,
  level: LogLevel,
  prefix: boolean | LogPrefixFn
): string {
  const logLevel = `${colorizeLogLevel(level)}: `;

  if (!prefix) {
    return logLevel;
  }

  if (typeof prefix === "function") {
    return `${prefix(name, level)} ${logLevel}`;
  }

  return `[${DefaultLogColors.prefixText(name)}] ${logLevel}`;
}

/**
 * Checks if the provided message contains ANSI color code symbols.
 *
 * @param {string} message the log message
 *
 * @returns {boolean} true if the message contains ANSI color codes, else false.
 */
function isAnsiColoredMessage(message: string): boolean {
  return /\\u001b\[\d+m/.test(message);
}

/**
 * Checks if the provided log message contains an escaped newline character.
 *
 * @param {LogMessage[]} logMessage the log message
 *
 * @returns {boolean} true if the message contains an escaped newline character, else false.
 */
function isMessageNewlineEscaped(logMessage: LogMessage[]): boolean {
  return logMessage.some((message) => typeof message === "string" && message.includes("\n"));
}
