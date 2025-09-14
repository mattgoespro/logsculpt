// lib/logging/logger.ts
import chalk3 from "chalk";

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

// lib/logging/model.ts
import chalk2 from "chalk";
var DefaultLogColors = {
  text: chalk2.grey,
  prefixText: chalk2.green,
  info: chalk2.blue,
  warn: chalk2.yellow,
  error: chalk2.red
};

// lib/formatting/pretty-stringify.ts
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
        return stringifyArray(value, options, initialIndent);
      }
      if (Object.keys(value).length === 0) {
        return "{}";
      }
      return stringifyObject(value, options, initialIndent);
    default:
      throw new Error(`Unsupported object type: ${typeof value}`);
  }
}
function stringifyArray(array, options, indent) {
  const formattedArray = array.map(
    (value) => `${" ".repeat(indent + 2)}${prettyStringify(value, { ...options, indent: indent + 2 })}`
  ).join(`,
`);
  return `[
${formattedArray}
${" ".repeat(indent)}]`;
}
function stringifyObject(object, options, indent = 0) {
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
function createLogger(name, options) {
  const prefix = options?.prefix ?? true;
  const print = options?.printer ?? console.log;
  const createLogMessage = (message, createOptions) => {
    return prettyStringify(message, options).split("\n").map(
      (line) => `${stringifyPrefixWithLevel(name, createOptions.level, prefix)}${isAnsiColoredMessage(line) ? line : DefaultLogColors.text(line)}`
    ).join("\n");
  };
  const logInfo = (...messageArgs) => {
    const messageLines = messageArgs.flatMap(
      (message) => typeof message === "string" ? message.split("\n") : message
    );
    if (isMessageNewlineEscaped(messageArgs)) {
      for (const messageLine of messageLines) {
        print(createLogMessage(messageLine, { level: "info", addPrefix: prefix }));
      }
      return;
    }
    print(
      messageArgs.map((arg) => createLogMessage(arg, { level: "info", addPrefix: prefix })).join(" ")
    );
  };
  const logger = {
    info: logInfo,
    next: logInfo,
    warn: (...messageArgs) => print(
      `${messageArgs.map((arg) => createLogMessage(arg, { level: "warn", addPrefix: prefix })).join(" ")}`
    ),
    error: (...messageArgs) => print(
      `${messageArgs.map((arg) => createLogMessage(arg, { level: "error", addPrefix: prefix })).join(" ")}`
    ),
    singleError: (error) => {
      print(`${stringifyPrefixWithLevel(name, "error", prefix)}${error.message}`);
      if (error.stack != null) {
        print(
          error.stack.split("\n").map((line) => `${stringifyPrefixWithLevel(name, "error", prefix)}${line}`).join("\n")
        );
      }
    },
    createLogMessage
  };
  return logger;
}
var PrefixNameLogPreset = (name, level) => `[${DefaultLogColors.prefixText(name)}] ${colorizeLogLevel(level)}: `;
function colorizeLogLevel(level) {
  let style = chalk3.bold;
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
function stringifyPrefixWithLevel(name, level, prefix) {
  const logLevel = `${colorizeLogLevel(level)}: `;
  if (!prefix) {
    return logLevel;
  }
  if (typeof prefix === "function") {
    return `${prefix(name, level)} ${logLevel}`;
  }
  return `[${DefaultLogColors.prefixText(name)}] ${logLevel}`;
}
function isAnsiColoredMessage(message) {
  return /\\u001b\[\d+m/.test(message);
}
function isMessageNewlineEscaped(logMessage) {
  return logMessage.some((message) => typeof message === "string" && message.includes("\n"));
}
export {
  PrefixNameLogPreset,
  colorizeLogLevel,
  createLogger
};
