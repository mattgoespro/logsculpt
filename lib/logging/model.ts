import { PrettyStringifyOptions } from "lib/formatting/pretty-stringify";

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
