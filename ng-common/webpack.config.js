'use strict';

const path = require('path');

module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    filename: 'ng-common.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'ngCommon',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules/, /bower_components/],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};
