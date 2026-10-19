const next = require("eslint-config-next");
const prettier = require("eslint-config-prettier");

module.exports = [
  ...next,
  prettier,
  {
    settings: {
      next: {
        rootDir: ["apps/*/"],
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-key": "off",
    },
  },
  {
    ignores: ["dist/**", ".next/**", "out/**", "build/**"],
  },
];
