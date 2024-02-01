/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
const eslintVue = require('linting/eslint-vue');

module.exports = {
  ...eslintVue,
};
