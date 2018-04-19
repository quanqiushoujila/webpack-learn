const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval-source-map',
  devServer: {
    port: 9001,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    overlay: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}