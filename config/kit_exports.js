const path = require("path");
const fs = require("fs");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  "components/AsciiTable": resolveApp("src/components/AsciiTable"),
  "components/Chart": resolveApp("src/components/Chart"),
  "components/Render": resolveApp("src/components/Render"),
  "components/Cypher": resolveApp("src/components/Cypher"),
  "components/DesktopIntegration": resolveApp(
    "src/components/DesktopIntegration"
  ),
  "components/DriverProvider": resolveApp("src/components/DriverProvider"),
  "components/GraphAppBase": resolveApp("src/components/GraphAppBase"),
  "components/Editor": resolveApp("src/components/Editor"),
  "components/Sidebar": resolveApp("src/components/Sidebar"),
  "lib/utils": resolveApp("src/lib/utils"),
  "lib/boltTransforms": resolveApp("src/lib/boltTransforms")
};
