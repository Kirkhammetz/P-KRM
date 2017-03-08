const path = require('path')
const webpack = require('webpack')

const PATHS = {
  js: path.resolve(__dirname, 'public/js'),
  public: path.resolve(__dirname, 'public/'),
  jsSource: path.resolve(__dirname, 'public/js/source'),
  scssSource: path.resolve(__dirname, 'public/styles/scss'),

  //- Admin Dashboard
  dashboard: path.resolve(__dirname, 'dashboard'),
}

module.exports = {
  entry: {
    //- Public Bundle
    'main.public': path.resolve(PATHS.jsSource, 'main.js'),

    dashboard: path.resolve(PATHS.dashboard, 'Main.jsx'),
  },

  output: {
    filename: '[name].js',
    path: PATHS.js,
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'dashboard'),
      path.resolve(__dirname, 'public/js/source'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
}
