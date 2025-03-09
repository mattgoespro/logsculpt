import boxen from "boxen";
import chalk from "chalk";
/**
 * Create a formatted error, surrounded by a box with a title and custom options that are used to
 * format the main error message.
 */
export class FormattedError extends Error {
    options;
    cause;
    constructor(message, options) {
        super(message, options);
        this.options = options;
        this.message = this._formatMessage(options?.cause);
    }
    /**
     * Determines whether the given error is an instance of FormattedError.
     *
     * @param error the error to check
     * @returns true if the error is an instance of FormattedError, otherwise false.
     */
    static isInstance(error) {
        return error instanceof FormattedError;
    }
    _formatMessage(cause) {
        const createErrorBox = (title, contents, options = {
            padding: 1,
            borderStyle: "double"
        }) => boxen(contents, { title, ...options, borderColor: "red" });
        const message = this.options != null ? this.getErrorMessage(this.message, this.options) : this.message;
        let errorBoxContents = message.split("\n");
        let errorBoxWidth = errorBoxContents.reduce((max, line) => Math.max(max, line.length), 0);
        if (cause == null) {
            return createErrorBox(this.name, message, {
                padding: 1,
                margin: 1,
                borderStyle: "double",
                width: errorBoxWidth + 10
            });
        }
        // Log the cause within the main error box
        const causeBox = createErrorBox("Cause", cause.message, {
            padding: 1,
            borderStyle: "round"
        });
        errorBoxContents = `${message}\n\n${causeBox}`.split("\n");
        errorBoxWidth = errorBoxContents
            .filter(Boolean)
            .reduce((max, line) => Math.max(max, line.length), 0);
        return createErrorBox(this.name, `${message}\n\n${chalk.red(causeBox)}`, {
            padding: 1,
            margin: 1,
            borderStyle: "double",
            width: errorBoxWidth + 10
        });
    }
}
