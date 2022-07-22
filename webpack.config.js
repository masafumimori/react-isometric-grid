const path = require('path')
const webpack = require('webpack')
// const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const target = process.env.TARGET || 'umd'

// const styleLoader = {
//   loader: 'style-loader',
//   options: { insert: 'top' },
// };

const fileLoader = {
  loader: 'file-loader',
  options: { name: 'static/[name].[ext]' },
}

// const postcssLoader = {
//   loader: 'postcss-loader',
//   options: {
//     plugins: () => [
//       autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] }),
//     ],
//   },
// };

// const cssLoader = (isLocal) => ({
//   loader: 'css-loader',
//   options: {
//     modules: true,
//     '-autoprefixer': true,
//     importLoaders: true,
//     localIdentName: isLocal ? 'rst__[local]' : null,
//   },
// });

const config = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactSortableTree',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // Use uglify for dead code removal
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   mangle: false,
    //   beautify: true,
    //   comments: true,
    // }),
  ],
  module: {
    rules: [
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.tsx?$/, loader: 'babel-loader' },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  target: ['web', 'es5'],
}

switch (target) {
  case 'umd':
    // Exclude library dependencies from the bundle
    config.externals = [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ]
    break
  case 'development':
    config.devtool = 'eval-source-map'
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    })
    config.entry = ['react-hot-loader/patch', './examples/basic-example/index']
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    }
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './examples/basic-example/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin(),
    ]
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port: process.env.PORT || 3001,
      stats: 'minimal',
    }

    break
  case 'demo':
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    })
    config.entry = './examples/basic-example/index'
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    }
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './examples/basic-example/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ]

    break
  default:
}

module.exports = config

// REF: https://medium.com/swlh/setting-up-a-react-typescript-sass-webpack-and-babel-7-project-in-6-steps-b4d172d1d0d6
