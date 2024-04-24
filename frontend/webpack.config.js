const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mainJSPath = path.resolve(__dirname, './src', 'main.js')
const mainCSSPath = path.resolve(__dirname, './src', 'main.css')
const imagesPath = path.resolve(__dirname, './src/images')
const publicPath = path.resolve(__dirname, './assets')

module.exports = {
  entry: {
    main: [
      mainJSPath,
      mainCSSPath
    ],
  },
  output: {
    filename:
      process.env.NODE_ENV === 'prod'
        ? 'scripts/[name].min.js?h=[hash]'
        : 'scripts/[name].js?h=[hash]',
    path: publicPath,
    publicPath: '/assets/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(
      {
        dry: false,
        verbose: true,
        cleanStaleWebpackAssets: false
      }
    ),
    // Simply copy assets to dist folder
    new CopyWebpackPlugin([
      { from: imagesPath, to: 'images' }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: path.resolve(__dirname, './templates/index.mustache'),
      hash: true,
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/main.css?h=[hash]',
      fallback: 'style-loader',
      ignoreOrder: false
    })
  ],
  module: {
    rules: [
      // ES2015 to ES5 compilation
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'standard-loader?error=true'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: 'public/styles',
              hmr: process.env.NODE_ENV === 'dev'
            }
          },
          'css-loader',
        ]
      }
    ]
  }
}
