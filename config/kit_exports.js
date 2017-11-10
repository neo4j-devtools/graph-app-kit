const path = require("path");
const fs = require("fs");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  "ui/Render": resolveApp("src/ui/Render"),
  "ui/AsciiTable": resolveApp("src/ui/AsciiTable"),
  "ui/Chart": resolveApp("src/ui/Chart"),
  "utils/Cypher": resolveApp("src/utils/Cypher"),
  "utils/DesktopIntegration": resolveApp("src/utils/DesktopIntegration"),
  "utils/DriverProvider": resolveApp("src/utils/DriverProvider")
};
