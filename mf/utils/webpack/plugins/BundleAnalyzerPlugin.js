const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const getBundleAnalyzerPlugin = function (isDev, config) {
  if (!isDev || !config.useAnalyzer) {
    return null
  }

  return new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerHost: config.analyzerHost,
    analyzerPort: config.analyzerPort,
  })
}

module.exports = { getBundleAnalyzerPlugin }
