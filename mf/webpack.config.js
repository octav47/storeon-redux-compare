const fs = require('fs');
const path = require('path');
const { getMFConfig } = require('./mf.config');

const ROOT_PATH = path.resolve(__dirname);
const PACKAGES_DIR = path.resolve(ROOT_PATH, 'packages');
const webpackConfigs = [];

const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

const passVariables =
  (extraParams = {}) =>
  (configFunction) => {
    return (env, params) =>
      configFunction(env, {
        ...params,
        ...extraParams,
      });
  };

fs.readdirSync(PACKAGES_DIR).forEach((packageName) => {
  const packagePath = path.resolve(PACKAGES_DIR, packageName);
  const packageWebpackConfigs = fs
    .readdirSync(packagePath)
    .filter((file) => file.includes('webpack.config.js'))
    .map((config) => require(path.resolve(packagePath, config)))
    .map(
      passVariables({
        ROOT_PATH,
        PACKAGE_PATH: packagePath,
        DIST_PATH,
        getMFConfig: (mode) => getMFConfig(mode, packageName),
      })
    );

  webpackConfigs.push(...packageWebpackConfigs);
});

module.exports = webpackConfigs;
