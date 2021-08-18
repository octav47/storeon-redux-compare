const getImageLoaders = function () {
  return {
    test: /\.(png|jpe?g|gif)$/i,
    use: [{ loader: 'file-loader' }],
  }
}

module.exports = { getImageLoaders }
