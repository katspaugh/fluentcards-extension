const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? null : 'source-map',
  cache: true,
  debug: true,

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
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json'
      },
      {
        from: 'src/assets/*.png',
        to: path.resolve(__dirname, 'dist/[name].[ext]')
      },
      {
        from: 'src/popup/index.html',
        to: path.resolve(__dirname, 'dist/popup.html')
      },
      {
        from: 'src/options/index.html',
        to: path.resolve(__dirname, 'dist/options.html')
      }
    ]),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: [ 'babel?cacheDirectory' ],
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      {
        test: /\.css$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }
    ]
  }
};
