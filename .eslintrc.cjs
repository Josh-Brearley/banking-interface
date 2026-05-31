/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.3" } },
  plugins: ["@typescript-eslint", "react-hooks", "react-refresh", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  ignorePatterns: ["dist", "coverage", "node_modules", "*.config.*"],
  overrides: [
    {
      // Design-system primitives intentionally co-export CVA variant helpers
      // and are generic element wrappers whose content is supplied by consumers.
      files: ["src/components/ui/**/*.tsx"],
      rules: {
        "react-refresh/only-export-components": "off",
        "jsx-a11y/heading-has-content": "off",
      },
    },
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // ARCH-NFR-03: no `any` in committed code.
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
