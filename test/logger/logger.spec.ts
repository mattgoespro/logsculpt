import { createLogger } from "logsculpt";
import stripAnsi from "strip-ansi";

describe("a `logsculpt` logger instance", () => {
  test("should prefix the log with the level", () => {
    const logger = createLogger("test");
    const infoMsg = logger.createLogMessage("Info message", { level: "info" });
    const warnMsg = logger.createLogMessage("Warn message", { level: "warn" });
    const errorMsg = logger.createLogMessage("Error message", { level: "error" });

    expect(stripAnsi(infoMsg)).toBe("[test] info: Info message");
    expect(stripAnsi(warnMsg)).toBe("[test] warn: Warn message");
    expect(stripAnsi(errorMsg)).toBe("[test] error: Error message");
  });

  describe("with prefixing disabled in the logger options", () => {
    test("should log a plain object without a prefix", () => {
      const logger = createLogger("log-object", { prefix: false });
      const msg = logger.createLogMessage({ a: 1, b: 2 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(`info: {
info:   a: 1,
info:   b: 2
info: }`);
    });

    test("should log a string without a prefix", () => {
      const logger = createLogger("log-string", { prefix: false });
      const msg = logger.createLogMessage("Hello, world!", { level: "info" });
      expect(stripAnsi(msg)).toBe("info: Hello, world!");
    });

    test("should log null without a prefix", () => {
      const logger = createLogger("log-null", { prefix: false });
      const msg = logger.createLogMessage(null, { level: "info" });
      expect(stripAnsi(msg)).toBe("info: null");
    });

    test("should log undefined without a prefix", () => {
      const logger = createLogger("log-undefined", { prefix: false });
      const msg = logger.createLogMessage(undefined, { level: "info" });
      expect(stripAnsi(msg)).toBe("info: undefined");
    });
  });

  describe("with no provided options", () => {
    test("should log a string with the prefix ", () => {
      const logger = createLogger("log-with-prefix");
      const msg = logger.createLogMessage("Hello, world!", { level: "info" });
      expect(stripAnsi(msg)).toBe("[log-with-prefix] info: Hello, world!");
    });
  });

  describe("with a prefix function option provided", () => {
    test("should log with the provided prefix function", () => {
      const logger = createLogger("log-with-prefix-function", {
        prefix: (name: string) => `(${name})`
      });
      const msg = logger.createLogMessage("Hello, world!", { level: "info" });
      expect(stripAnsi(msg)).toBe("(log-with-prefix-function) info: Hello, world!");
    });
  });

  describe("with the specified option provided", () => {
    test("should log using the `objectKeyModifier` option", () => {
      const logger = createLogger("log-with-object-key-modifier", {
        objectKeyModifier: (key) => key.toUpperCase()
      });
      const msg = logger.createLogMessage({ a: 1, b: 2 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(`[log-with-object-key-modifier] info: {
[log-with-object-key-modifier] info:   A: 1,
[log-with-object-key-modifier] info:   B: 2
[log-with-object-key-modifier] info: }`);
    });

    test("should log using the `objectValueModifier` option", () => {
      const logger = createLogger("log-with-object-value-modifier", {
        objectValueModifier: (value) => (typeof value === "number" ? value * 2 : value).toString()
      });
      const msg = logger.createLogMessage({ a: 1, b: 2 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(`[log-with-object-value-modifier] info: {
[log-with-object-value-modifier] info:   a: 2,
[log-with-object-value-modifier] info:   b: 4
[log-with-object-value-modifier] info: }`);
    });

    test("should log using the `sortObjectKeys` option", () => {
      const logger = createLogger("log-with-sorted-object-keys", { sortObjectKeys: true });
      const msg = logger.createLogMessage({ b: 2, a: 1 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(`[log-with-sorted-object-keys] info: {
[log-with-sorted-object-keys] info:   a: 1,
[log-with-sorted-object-keys] info:   b: 2
[log-with-sorted-object-keys] info: }`);
    });

    test("should log using the `quoteStrings` option", () => {
      const logger = createLogger("log-with-quoted-strings", { quoteStrings: true });
      const msg = logger.createLogMessage({ a: "hello", b: "world" }, { level: "info" });
      expect(stripAnsi(msg)).toBe(`[log-with-quoted-strings] info: {
[log-with-quoted-strings] info:   a: "hello",
[log-with-quoted-strings] info:   b: "world"
[log-with-quoted-strings] info: }`);
    });
  });
});
