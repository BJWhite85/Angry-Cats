const path = require('path');
var SRC_DIR = path.join(__dirname, '/client/');

module.exports = {
  entry: `${SRC_DIR}index.js`,
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public') //this is the folder you want to save your bundle in
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  }
};