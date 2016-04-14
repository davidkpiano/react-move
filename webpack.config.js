/* eslint strict:0 */
'use strict';

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [],
  node: {
    fs: 'empty'
  }
  // devtool: 'inline-source-map'
};
