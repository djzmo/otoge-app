import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss"
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
                interop: 'compat'
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
                interop: 'compat'
            },
        ],
        plugins: [
            postcss({
                plugins: [autoprefixer()],
                sourceMap: true,
                extract: true,
                minimize: true
            }),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
        ],
        external: ["react", "react-dom"],
    },
    {
        input: "src/index.ts",
        external: [/\.(css|less|scss)$/],
        output: [{ file: "dist/types.d.ts", format: "es" }],
        plugins: [dts.default()],
    },
];