const path = require('path')
const webpack = require('webpack')

const PATHS = {
  js: path.resolve(__dirname, 'public/js'),
  public: path.resolve(__dirname, 'public/'),
  jsSource: path.resolve(__dirname, 'public/js/source'),
  scssSource: path.resolve(__dirname, 'public/styles/scss'),
}

module.exports = {
  entry: {
    main: path.resolve(PATHS.jsSource, 'main.js'),
  },

  output: {
    filename: '[name].js',
    path: PATHS.js,
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { presets: [
        ['es2015', { modules: false }],
        'es2016',
        'es2017',
        'stage-0',
      ]},
    }],
  },

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
}
