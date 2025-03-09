import boxen from "boxen";
/**
 * Centers each line of text bounded by a specified width.
 *
 * @param lines - A single string or an array of strings representing the lines of text to be centered.
 * @param width - The maximum width within which to center the text. If not provided, the width of the longest line is used.
 * @returns An array of strings where each string is a centered line of text.
 */
export function centerTextLines(lines, width) {
    if (typeof lines === "string") {
        lines = [lines];
    }
    const maxLineWidth = lines.reduce((maxWidth, line) => (line.length > maxWidth ? line.length : maxWidth), lines[0].length);
    if (width != null && width < maxLineWidth) {
        console.warn(`The specified width of ${width} is less than the maximum line width of ${maxLineWidth}.`);
    }
    return lines.map((line) => centerTextLine(line, width ?? maxLineWidth));
}
/**
 * Centers a given text within a specified line width by padding it with spaces.
 * If the text length is greater than or equal to the line width, a warning is logged and the original text is returned.
 *
 * @param text - The text to be centered.
 * @param lineWidth - The width of the line within which the text should be centered.
 * @returns The centered text padded with spaces, or the original text if it exceeds the specified line width.
 */
function centerTextLine(text, lineWidth) {
    if (text.length >= lineWidth) {
        console.warn(`The text length of ${text.length} is greater than the specified line width of ${lineWidth}.`);
        return text;
    }
    return text.padStart((lineWidth + text.length) / 2, " ").padEnd(lineWidth, " ");
}
/**
 * Creates a nested box structure with the given content boxes.
 *
 * @param boxes - An array of content boxes, where each box has a title and contents.
 * @returns A formatted string that nests the content boxes within each other.
 */
export function nestContentBoxes(...boxes) {
    let output = "";
    const reverseOrderedBoxes = boxes.reverse();
    for (let i = 0; i < reverseOrderedBoxes.length; i++) {
        const box = reverseOrderedBoxes[i];
        const boxWidth = output
            .split("\n")
            .reduce((maxWidth, line) => (line.length > maxWidth ? line.length : maxWidth), 0);
        output = boxen([box.contents, output].join("\n"), {
            title: box.title,
            titleAlignment: "center",
            textAlignment: "center",
            padding: 1,
            margin: 1,
            borderStyle: "double",
            width: boxWidth
        });
    }
    return output;
}
/**
 * Converts a given value to a pretty-printed string representation.
 *
 * @param value - The value to be pretty-printed. Can be of any type.
 * @param options - Optional formatting options for JSON strings.
 * @param indent - The number of spaces to use for indentation. Default is 0.
 * @returns The pretty-printed string representation of the value.
 * @throws Will throw an error if the value type is unsupported.
 */
export function prettyStringify(value, options, indent = 0) {
    switch (typeof value) {
        case "string":
            return options?.quoteStrings ? `"${value}"` : value;
        case "boolean":
        case "number":
        case "undefined":
            return value.toString();
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
                return formatArray(value, options, indent);
            }
            if (Object.keys(value).length === 0) {
                return "{}";
            }
            return formatObject(value, options, indent);
        default:
            throw new Error(`Unsupported object type: ${typeof value}`);
    }
}
/**
 * Formats an array of objects into a pretty-printed JSON string with the specified indentation.
 *
 * @param array - The array of objects to format.
 * @param options - Optional formatting options.
 * @param indent - Indentation level.
 * @returns The formatted array as a JSON string.
 */
function formatArray(array, options, indent) {
    const formattedArray = array
        .map((value) => `${" ".repeat(indent + 2)}${prettyStringify(value, options, indent + 2)}`)
        .join(`,\n`);
    return `[\n${formattedArray}\n${" ".repeat(indent)}]`;
}
/**
 * Formats a given object into a pretty-printed string representation.
 *
 * @param object - The object to format.
 * @param options - Optional formatting options.
 * @param indent - The number of spaces to use for indentation (default is 0).
 * @returns The formatted string representation of the object.
 */
function formatObject(object, options, indent = 0) {
    const keyModifier = options?.objectKeyModifier ?? ((key) => key);
    const valueModifier = options?.objectValueModifier ?? ((value) => `${value}`);
    const formattedObject = (options?.sortObjectKeys
        ? Object.entries(object).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        : Object.entries(object))
        .map(([key, value]) => {
        if (value == null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${valueModifier(value)}`;
        }
        return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${prettyStringify(value, options, indent + 2)}`;
    })
        .join(`,\n`);
    return `{\n${formattedObject}\n${" ".repeat(indent)}}`;
}
