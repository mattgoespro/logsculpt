import chalk from "chalk";
import "./chalk";
import { prettyStringify } from "../formatting/text-formatting";
/**
 * Formats the log level with a color.
 * @param level the log level
 * @returns the formatted log level
 */
function formatLogLevel(level) {
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
export function createLogger(name) {
    const createLogMessage = (message, addPrefix = false) => {
        return `${addPrefix ? `[${chalk.green(name)}]: ` : ""}${chalk.grey(prettyStringify(message, { sortObjectKeys: true, quoteStrings: false }))}`;
    };
    const logger = {
        info: (...messageArgs) => {
            /**
             * A message has multiple lines if at least one of the message arguments is a string that contains a newline character.
             * In this case, we split the message into lines and log each line separately.
             */
            const messageLines = messageArgs.flatMap((message) => typeof message === "string" ? message.split("\n") : message);
            if (hasLineBreaks(messageArgs)) {
                for (const messageLine of messageLines) {
                    console.log(`${formatLogLevel("info")}: ${createLogMessage(messageLine)}`);
                }
                return;
            }
            console.log(`${formatLogLevel("info")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`);
        },
        warn: (...messageArgs) => console.warn(`${formatLogLevel("warn")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
        error: (...messageArgs) => console.error(`${formatLogLevel("error")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
        singleError: (error) => console.error(`${formatLogLevel("error")}: ${error.message}`),
        createLogMessage
    };
    return logger;
}
function hasLineBreaks(logMessage) {
    return logMessage.some((message) => typeof message === "string" && message.includes("\n"));
}
