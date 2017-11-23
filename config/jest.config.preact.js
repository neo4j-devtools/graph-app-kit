const base = require("./jest.config.base");

const out = Object.assign({}, base, {
  moduleNameMapper: Object.assign({}, base.moduleNameMapper, {
    "^react$": "preact-compat",
    "^react-dom$": "preact-compat"
  }),
  snapshotSerializers: ["preact-render-spy/snapshot"]
});

module.exports = out;
