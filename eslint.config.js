
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",  // Allows using 'process' without ESLint errors
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn", // Optional: Show warnings instead of errors
    },
  },
];
