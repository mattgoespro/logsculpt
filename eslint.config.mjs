import eslintPrettier from "eslint-config-prettier";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    files: ["lib"]
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    ignores: ["node_modules", "dist", "temp"]
  },
  eslintTs.configs.recommended,
  eslintPrettier
);
