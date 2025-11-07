import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),

    // 🔧 Aquí la corrección importante:
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      browser: true, // 👈 Usa versiones para navegador
      preferBuiltins: false, // 👈 No resuelve módulos de Node
    }),

    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      exclude: ["**/*.test.ts", "**/*.test.tsx", "node_modules/**"],
    }),

    postcss({
      config: {
        path: "./postcss.config.js",
      },
      modules: {
        generateScopedName: '[local]__[hash:base64:5]', // nombres únicos
      },
      extensions: [".css"],
      minimize: true,
      inject: true,
    }),

    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
  ],

  // 🔒 Evita incluir React y dependencias externas
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "socket.io-client",
  ],
};
