const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV,

  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  cache: true,

  entry: {
    content: [ path.resolve(__dirname, 'src/content/index.js') ],
    background: [ path.resolve(__dirname, 'src/background/index.js') ],
    popup: [ path.resolve(__dirname, 'src/popup/index.js') ],
    options: [ path.resolve(__dirname, 'src/options/index.js') ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader?cacheDirectory',
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true
        }
      }
    ]
  }
};
