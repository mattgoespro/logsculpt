import chalk from "chalk";
import "../formatting/chalk";
import { prettyStringify, PrettyStringifyOptions } from "../formatting/text-formatting";

export type Logger = {
  info: (...messageArgs: LogMessage[]) => void;
  warn: (...messageArgs: LogMessage[]) => void;
  error: (...messageArgs: LogMessage[]) => void;
  singleError: (error: Error) => void;
  createLogMessage: (message: LogMessage, addPrefix?: boolean) => string;
};

export type LoggerPrefix = boolean | ((name: string) => string);
export type LoggerOptions = PrettyStringifyOptions;

type LogMessage = unknown;

/**
 * Formats the log level with a color.
 * @param level the log level
 * @returns the formatted log level
 */
export function formatLogLevel(level: "info" | "warn" | "error") {
  let style = chalk.bold;

  switch (level) {
    case "info":
      style = style.blue;
      break;
    case "warn":
      style = style.yellow;
      break;
    case "error":
      style = style.red;
      break;
  }
  return chalk.dim.gray(style(level));
}
/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
export function createLogger(name: string, options?: LoggerOptions): Logger {
  let prefix: string = "";

  switch (typeof options?.prefix) {
    case "function":
      prefix = `${options.prefix(name)} `;
      break;
    case "boolean":
      prefix = options.prefix ? `[${name}] ` : "";
      break;
    default:
      prefix = `[${name}] `;
  }

  const createLogMessage = (message: LogMessage) => {
    return `${chalk.green(prefix)}${chalk.grey(prettyStringify(message, options))}`;
  };

  const logger: Logger = {
    info: (...messageArgs: LogMessage[]) => {
      /**
       * A message has multiple lines if at least one of the message arguments is a string that contains a newline character.
       * In this case, we split the message into lines and log each line separately.
       */
      const messageLines = messageArgs.flatMap((message) =>
        typeof message === "string" ? message.split("\n") : message
      );

      if (hasLineBreaks(messageArgs)) {
        for (const messageLine of messageLines) {
          console.log(`${formatLogLevel("info")}: ${createLogMessage(messageLine)}`);
        }
        return;
      }

      console.log(
        `${formatLogLevel("info")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      );
    },
    warn: (...messageArgs: LogMessage[]) =>
      console.warn(
        `${formatLogLevel("warn")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      ),
    error: (...messageArgs: LogMessage[]) =>
      console.error(
        `${formatLogLevel("error")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      ),
    singleError: (error: Error) => console.error(`${formatLogLevel("error")}: ${error.message}`),
    createLogMessage
  };

  return logger;
}

function hasLineBreaks(logMessage: LogMessage[]): boolean {
  return logMessage.some((message) => typeof message === "string" && message.includes("\n"));
}
