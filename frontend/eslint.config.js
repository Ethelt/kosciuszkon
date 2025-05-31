import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import configReactRecommended from "eslint-plugin-react/configs/recommended.js";
import configImportTypescript from "eslint-plugin-import/config/typescript.js";
import tseslint from "typescript-eslint";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "yarn.lock", "node_modules/"],
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": pluginSimpleImportSort,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      // React
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off", // Not needed in React 17+

      // TypeScript
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-for-in-array": "off",
      "@typescript-eslint/no-misused-promises": "off",

      // React specific
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",

      // Import sorting
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // Side effect imports
            ["^react$", "^@?\\w"], // Packages
            ["^@", "^"], // Aliases and absolute
            ["^\\./"], // Relative
            ["^.+\\.(module\\.(css|scss)|css|scss)$"], // Styles
            ["^.+\\.(gif|png|svg|jpg|jpeg|webp|avif)$"], // Media
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // Import hygiene
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // Prettier integration
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      configReactRecommended,
      configImportTypescript,
    ],
  },
);
