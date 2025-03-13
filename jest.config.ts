/**
 * Jest configuration.
 *
 * @see https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import path from "path";

const config: Config = {
  preset: "ts-jest",
  rootDir: path.resolve(__dirname),
  roots: ["<rootDir>/test"],
  moduleDirectories: ["node_modules", "lib"],
  moduleFileExtensions: ["ts", "js"],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^logsculpt$": "<rootDir>/lib/index.ts"
  },
  modulePaths: ["<rootDir>/lib"],
  extensionsToTreatAsEsm: [".ts"],
  globalSetup: path.resolve(__dirname, "test", "setup.ts"),
  clearMocks: true,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true
      }
    ]
  }
  // globals: {
  //   "ts-jest": {
  //     useESM: true
  //   }
  // }
};

export default config;
