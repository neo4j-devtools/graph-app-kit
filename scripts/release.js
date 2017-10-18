const fs = require("fs");

const filesToCopy = ["package.json", "README.md", "LICENSE.txt"];

filesToCopy.forEach(file => fs.copyFileSync("./" + file, "dist/" + file));
