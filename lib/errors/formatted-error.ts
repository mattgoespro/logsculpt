import boxen, { Options } from "boxen";
import chalk from "chalk";

type FormattedErrorOptions<T = undefined> = T extends undefined ? ErrorOptions : ErrorOptions & T;

/**
 * Create a formatted error, surrounded by a box with a title and custom options that are used to
 * format the main error message.
 */
export abstract class FormattedError<O = undefined> extends Error {
  cause?: Error;

  constructor(
    message: string,
    public options?: FormattedErrorOptions<O>
  ) {
    super(message, options);
    this.message = this._formatMessage(options?.cause as Error);
  }

  /**
   * Determines whether the given error is an instance of FormattedError.
   *
   * @param error the error to check
   * @returns true if the error is an instance of FormattedError, otherwise false.
   */
  static isInstance<T extends Record<string, unknown>>(error: unknown): error is FormattedError<T> {
    return error instanceof FormattedError;
  }

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

  private _formatMessage(cause?: Error): string {
    const createErrorBox = (
      title: string,
      contents: string,
      options: Options = {
        padding: 1,
        borderStyle: "double"
      }
    ) => boxen(contents, { title, ...options, borderColor: "red" });

    const message =
      this.options != null ? this.getErrorMessage(this.message, this.options) : this.message;
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
