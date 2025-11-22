import { createLogger } from "logsculpt";
import stripAnsi from "strip-ansi";
import dedent from "dedent";
import jest from "jest-mock";

describe("a `logsculpt` logger instance", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("should log an object on a new line", () => {
    const logger = createLogger("test", { prefix: false });
    logger.info("A and B before", { a: 1, b: 2 }, "C and D after");

    const logged = stripAnsi(logSpy.mock.calls[0][0]);
    expect(logged).toBe(
      dedent`[test] info: A and B before
      info: {
      info:   a: 1,
      info:   b: 2
      info: }
      info: C and D after`
    );
  });
});
