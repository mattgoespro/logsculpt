type FormattedErrorOptions<T = undefined> = T extends undefined ? ErrorOptions : ErrorOptions & T;
/**
 * Create a formatted error, surrounded by a box with a title and custom options that are used to
 * format the main error message.
 */
export declare abstract class FormattedError<O extends Record<string, unknown> = undefined> extends Error {
    options?: FormattedErrorOptions<O>;
    cause?: Error;
    constructor(message: string, options?: FormattedErrorOptions<O>);
    /**
     * Determines whether the given error is an instance of FormattedError.
     *
     * @param error the error to check
     * @returns true if the error is an instance of FormattedError, otherwise false.
     */
    static isInstance<T extends Record<string, unknown>>(error: unknown): error is FormattedError<T>;
    /**
     * Format the message that is displayed inside the outermost border-box given the error message and options.
     *
     * This method must be overridden by subclasses if this class is extended.
     *
     * @param message the main message passed to the error
     * @param options additional options passed to the error
     * @returns the formatted error message
     */
    protected abstract getErrorMessage(message: string, options: FormattedErrorOptions<O>): string;
    private _formatMessage;
}
export {};
