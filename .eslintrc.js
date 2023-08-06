module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "plugin:vue/base",
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {},
};
