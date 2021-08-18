const getTypescriptLoaders = function () {
  return {
    test: /\.[tj]sx?$/,
    exclude: /node_modules(?!\/@lognex)/, // node_modules/@lognex надо оставить, там есть исходники
    use: [
      {
        loader: 'babel-loader',
        options: {
          sourceMap: true,
          presets: [require.resolve('@babel/preset-typescript')],
        },
      },
    ],
  }
}

module.exports = { getTypescriptLoaders }
