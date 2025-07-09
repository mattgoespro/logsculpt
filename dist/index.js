// lib/logging/logger.ts
import chalk2 from "chalk";

// lib/formatting/chalk.ts
import chalk from "chalk";
var Colors = {
  orange: "#ff8800",
  gold: "#CDAA35",
  darkGrey: "#3B3B3B",
  dark: "#0e0e0e",
  lightGrey: "#C5C5C5",
  darkPurple: "#6C0BA9",
  purple: "#A020F0",
  lightPurple: "#C576F6",
  darkGreen: "#035800"
};
Object.assign(chalk, {
  orange: chalk.hex(Colors.orange),
  gold: chalk.hex(Colors.gold),
  darkGrey: chalk.hex(Colors.darkGrey),
  dark: chalk.hex(Colors.dark),
  lightGrey: chalk.hex(Colors.lightGrey),
  purple: chalk.hex(Colors.darkPurple),
  lightPurple: chalk.hex(Colors.lightPurple),
  darkGreen: chalk.hex("#035800")
});

// lib/formatting/text-formatting.ts
import boxen from "boxen";
function prettyStringify(value, options) {
  const initialIndent = options?.indent ?? 0;
  switch (typeof value) {
    case "string":
      return options?.quoteStrings ? `"${value}"` : value;
    case "boolean":
    case "number":
      return value.toString();
    case "undefined":
      return "undefined";
    case "function":
      return value.toString();
    case "object":
      if (value === null) {
        return "null";
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "[]";
        }
        return formatArray(value, options, initialIndent);
      }
      if (Object.keys(value).length === 0) {
        return "{}";
      }
      return formatObject(value, options, initialIndent);
    default:
      throw new Error(`Unsupported object type: ${typeof value}`);
  }
}
function formatArray(array, options, indent) {
  const formattedArray = array.map(
    (value) => `${" ".repeat(indent + 2)}${prettyStringify(value, { ...options, indent: indent + 2 })}`
  ).join(`,
`);
  return `[
${formattedArray}
${" ".repeat(indent)}]`;
}
function formatObject(object, options, indent = 0) {
  const keyModifier = options?.objectKeyModifier ?? ((key) => key);
  const valueModifier = options?.objectValueModifier ?? ((value) => `${value}`);
  const formattedObject = (options?.sortObjectKeys ? Object.entries(object).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) : Object.entries(object)).map(([key, value]) => {
    if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      const quotedValue = options?.quoteStrings ? `"${value}"` : value;
      return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${valueModifier(quotedValue)}`;
    }
    return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${prettyStringify(value, {
      ...options,
      indent: indent + 2
    })}`;
  }).join(`,
`);
  return `{
${formattedObject}
${" ".repeat(indent)}}`;
}

// lib/logging/logger.ts
function formatLogLevel(level) {
  let style = chalk2.bold;
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
  return chalk2.dim.gray(style(level));
}
function createLogger(name, options) {
  let prefix = "";
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
  const createLogMessage = (message) => {
    return `${chalk2.green(prefix)}${chalk2.grey(prettyStringify(message, options))}`;
  };
  const logger = {
    info: (...messageArgs) => {
      const messageLines = messageArgs.flatMap(
        (message) => typeof message === "string" ? message.split("\n") : message
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
    warn: (...messageArgs) => console.warn(
      `${formatLogLevel("warn")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
    ),
    error: (...messageArgs) => console.error(
      `${formatLogLevel("error")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
    ),
    singleError: (error) => console.error(`${formatLogLevel("error")}: ${error.message}`),
    createLogMessage
  };
  return logger;
}
function hasLineBreaks(logMessage) {
  return logMessage.some((message) => typeof message === "string" && message.includes("\n"));
}
export {
  createLogger,
  formatLogLevel
};
