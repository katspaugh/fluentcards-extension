const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'content_script.js'
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: [ 'babel?cacheDirectory' ],
        include: [
          path.resolve(__dirname, 'src')
        ]
      }
    ]
  }
};
