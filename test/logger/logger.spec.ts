import { createLogger } from "logsculpt";
import stripAnsi from "strip-ansi";

describe("logger", () => {
  test("log object", () => {
    const logger = createLogger("log-object", { prefix: false });
    const msg = logger.createLogMessage({ a: 1, b: 2 });
    expect(stripAnsi(msg)).toBe(`{
  a: 1,
  b: 2
}`);
  });

  test("log string", () => {
    const logger = createLogger("log-string", { prefix: false });
    const msg = logger.createLogMessage("Hello, world!");
    expect(stripAnsi(msg)).toBe("Hello, world!");
  });

  test("log null", () => {
    const logger = createLogger("log-null", { prefix: false });
    const msg = logger.createLogMessage(null);
    expect(stripAnsi(msg)).toBe("null");
  });

  test("log undefined", () => {
    const logger = createLogger("log-undefined", { prefix: false });
    const msg = logger.createLogMessage(undefined);
    expect(stripAnsi(msg)).toBe("undefined");
  });

  test("log with prefix", () => {
    const logger = createLogger("log-with-prefix", { prefix: true });
    const msg = logger.createLogMessage("Hello, world!");
    expect(stripAnsi(msg)).toBe("[log-with-prefix] Hello, world!");
  });

  test("log with prefix function", () => {
    const logger = createLogger("log-with-prefix-function", {
      prefix: (name) => `(${name})`
    });
    const msg = logger.createLogMessage("Hello, world!");
    expect(stripAnsi(msg)).toBe("(log-with-prefix-function) Hello, world!");
  });

  test("log with option `objectKeyModifier`", () => {
    const logger = createLogger("log-with-object-key-modifier", {
      objectKeyModifier: (key) => key.toUpperCase()
    });
    const msg = logger.createLogMessage({ a: 1, b: 2 });
    expect(stripAnsi(msg)).toBe(`[log-with-object-key-modifier] {
  A: 1,
  B: 2
}`);
  });

  test("log with option `objectValueModifier`", () => {
    const logger = createLogger("log-with-object-value-modifier", {
      objectValueModifier: (value) => (typeof value === "number" ? value * 2 : value).toString()
    });
    const msg = logger.createLogMessage({ a: 1, b: 2 });
    expect(stripAnsi(msg)).toBe(`[log-with-object-value-modifier] {
  a: 2,
  b: 4
}`);
  });

  test("log with option `sortObjectKeys`", () => {
    const logger = createLogger("log-with-sorted-object-keys", { sortObjectKeys: true });
    const msg = logger.createLogMessage({ b: 2, a: 1 });
    expect(stripAnsi(msg)).toBe(`[log-with-sorted-object-keys] {
  a: 1,
  b: 2
}`);
  });

  test("log with option `quoteStrings`", () => {
    const logger = createLogger("log-with-quoted-strings", { quoteStrings: true });
    const msg = logger.createLogMessage({ a: "hello", b: "world" });
    expect(stripAnsi(msg)).toBe(`[log-with-quoted-strings] {
  a: "hello",
  b: "world"
}`);
  });

  test("log with different levels", () => {
    const logger = createLogger("test");
    const infoMsg = logger.createLogMessage("Info message");
    const warnMsg = logger.createLogMessage("Warn message");
    const errorMsg = logger.createLogMessage("Error message");

    expect(stripAnsi(infoMsg)).toBe("[test] Info message");
    expect(stripAnsi(warnMsg)).toBe("[test] Warn message");
    expect(stripAnsi(errorMsg)).toBe("[test] Error message");
  });
});
