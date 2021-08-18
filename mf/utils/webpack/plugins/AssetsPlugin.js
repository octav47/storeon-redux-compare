const AssetsPlugin = require('assets-webpack-plugin')

const getAssetsPlugin = function (appName, path) {
  return new AssetsPlugin({
    filename: `app-manifest-${appName}.json`,
    path,
    prettyPrint: true,
    // keepInMemory: true,
    metadata: {
      appName,
    },
  })
}

module.exports = { getAssetsPlugin }
