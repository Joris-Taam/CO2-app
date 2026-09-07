/* eslint-disable @typescript-eslint/typedef */
import typechecksPlugin from "@hboictcloud/esbuild-plugin-typechecks";
import { typecheckPlugin as interfacesTypecheckPlugin } from "@hboictcloud/typechecks-plugin-interfaces";

/** @type {import("@hboictcloud/esbuild-plugin-typechecks").Options} */
const typecheckOptions = {
    tsConfigPath: "./tsconfig.json",
    includePatterns: ["./global.d.ts", "./src/**/*.ts", "../shared/**/*.ts"],
    throwOnError: false,
    plugins: [
        interfacesTypecheckPlugin({
            metadataFilePath: "./src/metadata.generated.ts",
        }),
    ],
};

/** @type {import("@hboictcloud/esbuild-scripts").Options} */
const options = {
    entryPoints: ["./src/index.ts"],
    target: "node22",
    external: ["bcryptjs"],
    watchOptions: {
        outfile: "./temp/index.js",
        plugins: [], // typechecksPlugin tijdelijk uitgeschakeld (Node.js v22 incompatibiliteit)
    },
    buildOptions: {
        outfile: "../../dist/api/index.js",
        plugins: [            
            typechecksPlugin(typecheckOptions)
        ],
    },
};

export default options;
