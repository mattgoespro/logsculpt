import esbuild, { BuildOptions, Plugin } from "esbuild";
import { createLogger } from "logsculpt";

const Log = createLogger("build");

const logBuildResultsPlugin: Plugin = {
  name: "log-build-result",
  setup(build) {
    /**
     * This plugin logs the build results when the build completes.
     *
     * The `buildResult` object contains the following properties:
     * - errors: An array of error messages.
     * - warnings: An array of warning messages.
     * - outputFiles: An array of output files.
     *
     * Appropriate colors are used to highlight the different types of messages.
     *
     * The last line of the log message indicates whether the build was successful with the
     * number of errors and warnings, if present, or that the build was successful.
     */

    build.onStart(() => {
      Log.info("Starting build...");

      build.onEnd((buildResult) => {
        if (buildResult.errors.length > 0) {
          Log.error(`Build failed with ${buildResult.errors.length} error(s):`);

          for (const error of buildResult.errors) {
            Log.error(
              [`${error.location}:${error.id}: ${error.text}`, error.detail, error.notes].join("\n")
            );
          }
        } else if (buildResult.warnings.length > 0) {
          Log.warn(`Build succeeded with ${buildResult.warnings.length} warning(s):`);

          for (const warning of buildResult.warnings) {
            Log.warn(
              [
                `${warning.location}:${warning.id}: ${warning.text}`,
                warning.detail,
                warning.notes
              ].join("\n")
            );
          }
        } else {
          Log.info("Build succeeded");
        }
      });
    });
  }
};

try {
  Log.info("Building logsculpt...");

  await esbuild.build({
    platform: "node",
    entryPoints: ["lib/index.ts"],
    outdir: "dist",
    lineLimit: 80, // Configuring the line limit can increase the bundle size, so it should be set to a reasonable value.
    bundle: true,
    splitting: true,
    minify: true,
    sourcemap: false,
    format: "esm",
    plugins: [logBuildResultsPlugin]
  } satisfies BuildOptions);
} catch (e) {
  console.error(e);
  console.error("Failed to build the project");
}
