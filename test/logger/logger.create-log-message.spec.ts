import { createLogger } from "logsculpt";
import stripAnsi from "strip-ansi";
import dedent from "dedent";

describe("a `logsculpt` logger instance's `createLogMessage` function", () => {
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
      expect(stripAnsi(msg)).toBe(
        dedent`info: {
        info:   a: 1,
        info:   b: 2
        info: }
      `
      );
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
      const logger = createLogger("log-okm", {
        objectKeyModifier: (key) => key.toUpperCase()
      });
      const msg = logger.createLogMessage({ a: 1, b: 2 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(
        dedent`[log-okm] info: {
               [log-okm] info:   A: 1,
               [log-okm] info:   B: 2
               [log-okm] info: }`
      );
    });

    test("should log using the `objectValueModifier` option", () => {
      const logger = createLogger("log-ovm", {
        objectValueModifier: (value) => (typeof value === "number" ? value * 2 : value).toString()
      });
      const msg = logger.createLogMessage({ a: 1, b: 2 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(
        dedent`[log-ovm] info: {
               [log-ovm] info:   a: 2,
               [log-ovm] info:   b: 4
               [log-ovm] info: }`
      );
    });

    test("should log using the `sortObjectKeys` option", () => {
      const logger = createLogger("log-sok", { sortObjectKeys: true });
      const msg = logger.createLogMessage({ b: 2, a: 1 }, { level: "info" });
      expect(stripAnsi(msg)).toBe(
        dedent`[log-sok] info: {
               [log-sok] info:   a: 1,
               [log-sok] info:   b: 2
               [log-sok] info: }`
      );
    });

    test("should log using the `quoteStrings` option", () => {
      const logger = createLogger("log-qs", { quoteStrings: true });
      const msg = logger.createLogMessage({ a: "hello", b: "world" }, { level: "info" });
      expect(stripAnsi(msg)).toBe(
        dedent`[log-qs] info: {
               [log-qs] info:   a: "hello",
               [log-qs] info:   b: "world"
               [log-qs] info: }`
      );
    });
  });
});
