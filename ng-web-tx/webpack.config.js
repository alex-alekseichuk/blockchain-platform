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
    // publicPath: "/img/app-tx/"
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
  devServer: {
    contentBase: `${__dirname}/dist`,
    port: 3000,
    historyApiFallback: true,
    host: '0.0.0.0',
    // hot: true
  },
  // optimization: {
  //   minimize: false // to avoid packing dist. js code
  // }
};
