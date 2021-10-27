const path = require('path')
const packageJson = require('./package.json')
const md5 = require('crypto-js/md5')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      react: path.resolve(__dirname, './src/packages/wrapper-react.js'),
      // 'react-dom': path.resolve(__dirname, './src/packages/react_dom.js'),
    },
  },
  entry: {
    utils: path.resolve(__dirname, './src/index.js'),
    main: path.resolve(__dirname, './src/index.dart'),
  },
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/packages'),
          to: path.resolve(__dirname, './dist/packages'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __isDev__: JSON.stringify(true),
      VERSION: packageJson.version,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      { test: /\.dart$/, loader: 'dart-loader' },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*(\.css|\.scss|\.sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    // chunkIds: 'named',
    // moduleIds: 'named',
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module, chunks, cacheGroupKey) {
    //         const moduleFileName = module
    //           .identifier()
    //           .split('/')
    //           .reduceRight(item => item)
    //
    //         return `${cacheGroupKey}-${md5(moduleFileName)}`
    //       },
    //       chunks: 'all',
    //     },
    //   },
    // },
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    port: 8080,
    compress: true,
    publicPath: '/',
    // stats: 'minimal',
    // disableHostCheck: true,
    writeToDisk: true,
    // };
  },
}
