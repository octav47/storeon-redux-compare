const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getStyleLoaders = function () {
  return {
    test: /^((?!\.module).)*(\.css|\.scss|\.sass)$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'resolve-url-loader',
      'sass-loader',
    ],
  }
}

module.exports = { getStyleLoaders }
