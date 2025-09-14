/**
 * Jest configuration.
 *
 * @see https://jestjs.io/docs/configuration
 */

import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const tsEsmPresetConfig = createJsWithTsEsmPreset({});

export default {
  ...tsEsmPresetConfig,
  globals: {},
  moduleNameMapper: {
    "^logsculpt$": "<rootDir>/lib/index.ts"
  }
} satisfies JestConfigWithTsJest;
