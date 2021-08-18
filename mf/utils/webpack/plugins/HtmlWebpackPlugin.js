const HtmlWebpackPlugin = require('html-webpack-plugin')

const getHtmlWebpackPlugin = options => {
  return new HtmlWebpackPlugin(options)
}

module.exports = { getHtmlWebpackPlugin }
