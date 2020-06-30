// https://typescript-jp.gitbook.io/deep-dive/intro-1/jest
// https://jestjs.io/docs/ja/configuration
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // https://github.com/kulshekhar/ts-jest/issues/823
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    },
  },
}