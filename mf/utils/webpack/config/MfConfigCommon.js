const { getDefinePlugin } = require('../plugins/DefinePlugin')
const { getTypescriptLoaders } = require('../loaders/TypescriptLoaders')
const { getImageLoaders } = require('../loaders/ImageLoaders')
const { getSvgLoaders } = require('../loaders/SvgLoaders')
const { getStyleLoaders } = require('../loaders/StyleLoaders')
const packageJson = require('../../../package.json')
const { getAssetsPlugin } = require('../plugins/AssetsPlugin')
const { getBundleAnalyzerPlugin } = require('../plugins/BundleAnalyzerPlugin')
const md5 = require('crypto-js/md5')
const webpack = require('webpack')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const mfConfigCommon = (appName, env, params) => {
  const { PACKAGE_PATH, DIST_PATH, getMFConfig } = params
  const mode = params ? params.mode : 'development'
  const isDev = mode === 'development'

  const mfConfig = getMFConfig(mode)

  const entry = {
    [appName]: [path.resolve(PACKAGE_PATH, './src/index.js')],
  }

  const output = {
    path: DIST_PATH,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    library: appName,
    libraryTarget: 'umd',
  }

  const plugins = [
    getAssetsPlugin(appName, DIST_PATH),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    getDefinePlugin(isDev, packageJson.version),
    getBundleAnalyzerPlugin(isDev, mfConfig),

    isDev && new webpack.HotModuleReplacementPlugin(),
    isDev && new webpack.NoEmitOnErrorsPlugin(),
  ].filter(p => !!p)

  const config = {
    name: appName,
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
      extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      },
    },
    entry,
    target: 'web',
    mode,
    output,
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
    plugins,
    module: {
      rules: [
        getTypescriptLoaders(),
        getImageLoaders(),
        getSvgLoaders(),
        getStyleLoaders(),
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
              const allChunksNames = chunks.map(item => item.name).join('~')

              return `${cacheGroupKey}-${allChunksNames}-${md5(moduleFileName)}`
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
  }

  // if (params.hasDevServer) {
  config.devServer = {
    historyApiFallback: true,
    contentBase: DIST_PATH,
    host: mfConfig.host,
    port: mfConfig.port,
    compress: true,
    publicPath: `${mfConfig.host}:${mfConfig.port}`,
    stats: 'minimal',
    disableHostCheck: true,
    writeToDisk: true,
    // };
  }

  return config
}

module.exports = { mfConfigCommon }
