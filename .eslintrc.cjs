module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },
    plugins: ["prettier"],
    env: {
        node: true,
        browser: true,
    },
    extends: ["eslint:recommended", "prettier"],
    rules: {
        "prettier/prettier": "error",
        // "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "prettier",
            ],
            rules: {
                "@typescript-eslint/no-unused-vars": ["off"],
                "no-control-regex": "off",
            },
            settings: {
                react: {
                    version: "detect",
                },
            },
        },
    ],
};
