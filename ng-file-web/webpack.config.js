const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/app.js',
    ui: './src/ui.js'
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
    library: '[name]File',
    libraryTarget: 'var',
    // publicPath: "/img/app-file/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + `/src/index.html`,
      inject: "body",
      chunks: ['ui']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: {
          test   : path.resolve(__dirname, "node_modules"),
          exclude: path.resolve(__dirname, "node_modules/ng-common")
        },
        loaders: [
          'babel-loader',
          {loader: path.resolve(__dirname, 'node_modules/ng-common/util/ioc-webpack-loader.js')},
        ]
      }
    ]
  },
  externals: {
  },
  optimization: {
    minimize: false
  }
};
