const webpack = require('webpack')

const getDefinePlugin = function (isDev, version) {
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(
      isDev ? 'development' : 'production'
    ),
    __isDev__: JSON.stringify(isDev),
    VERSION: version,
  })
}

module.exports = { getDefinePlugin }
