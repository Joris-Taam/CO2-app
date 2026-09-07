import { defaults, rules } from "@hboictcloud/eslint-plugin";
import globals from "globals";
import path from "path";
import { fileURLToPath } from "url";

export function createEslintConfig(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);

    return [
        // Ignores
        {
            ignores: [
                "eslint.config.base.mjs",
                "**/esbuild.config.mjs",
                "**/eslint.config.mjs",
                "**/vitest.config.mjs",
                "**/vitest.config.ts",
                "**/vite.config.ts",
                "**/dist/",
            ],
        },
        // Defaults
        ...defaults,
        {
            languageOptions: {
                globals: {
                    ...globals.browser,
                },
                parserOptions: {
                    project: "./tsconfig.json",
                    tsconfigRootDir: __dirname,
                },
            },
        },
        // Rules
        ...rules,
        // Overrides
        {
            rules: {
                "@typescript-eslint/no-unnecessary-type-parameters": "off",
                "@typescript-eslint/no-misused-promises": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
            },
        },
    ];
}
