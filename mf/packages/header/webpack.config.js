const path = require('path')
const packageJson = require('./package.json')
const md5 = require('crypto-js/md5')
const webpack = require('webpack')

const AssetsPlugin = require('assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const appName = 'header'

module.exports = {
  name: appName,
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
    // alias: {
    //   react: path.resolve('./node_modules/react'),
    //   'react-dom': path.resolve('./node_modules/react-dom'),
    // },
  },
  entry: {
    [appName]: [path.resolve(__dirname, './src/index.js')],
  },
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    library: appName,
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
  },
  plugins: [
    new AssetsPlugin({
      filename: `app-manifest-${appName}.json`,
      path: path.resolve(__dirname, 'dist'),
      prettyPrint: true,
      // keepInMemory: true,
      metadata: {
        appName,
      },
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
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
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight(item => item)

            return `${cacheGroupKey}-${md5(moduleFileName)}`
          },
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    port: 8081,
    compress: true,
    // publicPath: '/',
    // stats: 'minimal',
    // disableHostCheck: true,
    writeToDisk: true,
    // };
  },
}
