const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval-source-map',
  devServer: {
    port: 9999,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    overlay: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}