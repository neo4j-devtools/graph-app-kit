module.exports = {
  rootDir: "../",
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  setupFiles: [
    "<rootDir>/config/polyfills.js",
    "<rootDir>/config/jest.polyfills.js"
  ],
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "^graph-app-kit(.*)": "<rootDir>/src$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy"
  },
  moduleFileExtensions: ["web.js", "js", "json", "web.jsx", "jsx", "node"]
};
