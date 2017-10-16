const fs = require("fs");
const del = require("del");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");
const pkg = require("../package.json");

process.env.NODE_ENV = "production";

const bundles = [
  {
    format: "cjs",
    ext: ".js",
    plugins: [resolve(), commonjs()],
    babelPresets: ["es2015-rollup", "react-app"],
    babelPlugins: []
  },
  {
    format: "es",
    ext: ".esm.js",
    plugins: [resolve()],
    babelPresets: ["es2015-rollup", "react-app"],
    babelPlugins: []
  }
];

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(["dist/*"]));

// Compile source code into a distributable format with Babel and Rollup
for (const config of bundles) {
  promise = promise.then(() =>
    rollup
      .rollup({
        input: "src/index.js",
        external: ["react", "prop-types"],
        plugins: [
          babel({
            babelrc: false,
            exclude: "node_modules/**",
            presets: config.babelPresets,
            plugins: config.babelPlugins
          })
        ].concat(config.plugins)
      })
      .then(bundle =>
        bundle.write({
          file: `dist/${config.moduleName || "main"}${config.ext}`,
          format: config.format,
          sourcemap: !config.minify,
          name: config.moduleName,
          globals: {
            react: "React",
            "prop-types": "PropTypes"
          }
        })
      )
  );
}

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
