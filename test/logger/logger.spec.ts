import { createLogger } from "logsculpt";
import stripAnsi from "strip-ansi";

describe("logger", () => {
  const logger = createLogger("test");

  test("logger", () => {
    const msg = logger.createLogMessage({ a: 1, b: 2 });
    /**
     * TODO: Use a helper function that inserts the ansi codes for assertion values,
     * instead of stripping the ansi codes from the actual value.
     */

    expect(stripAnsi(msg)).toBe(`{
  a: 1,
  b: 2
}`);
  });
});
