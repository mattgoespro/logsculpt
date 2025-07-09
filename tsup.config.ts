import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development",
  clean: true,
  target: "node22",
  bundle: true,
  format: "esm",
  minify: process.env.NODE_ENV === "production",
  outDir: "dist",
  dts: "lib/index.ts"
});
