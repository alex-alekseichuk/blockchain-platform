const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'authApp',
    libraryTarget: 'var'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Web client Auth. application logic'
    })
  ]
};
