module.exports = {
  rootDir: "../",
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  setupFiles: ["<rootDir>/config/polyfills.js"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^graph-app-kit(.*)": "<rootDir>/src$1"
  },
  moduleFileExtensions: ["web.js", "js", "json", "web.jsx", "jsx", "node"]
};
