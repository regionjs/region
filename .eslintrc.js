module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb"],
  "plugins": ["jest"],
  "env": {
    "jest/globals": true,
  },
  "rules": {
    "camelcase": [2, {allow: ["^private_"]}],
    "max-len": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "object-curly-newline": 0,
    "import/prefer-default-export": 0,
    "react/prop-types": 0
  }
};
