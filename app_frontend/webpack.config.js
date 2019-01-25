const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
require("@babel/polyfill");



const config = {
  entry: ["@babel/polyfill", path.resolve(__dirname, 'src/index.js')],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    // constrain files produced by hot reloading if --watch
    // see https://github.com/gaearon/react-hot-loader/issues/456#issuecomment-316522465
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/'),
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'FitApp',
      // filename: 'index.html'
    }),
    new BaseHrefWebpackPlugin({ baseHref: '/' }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "styles/[name].css",
    }),
    new webpack.HotModuleReplacementPlugin(),
   ]
};

module.exports = config;


