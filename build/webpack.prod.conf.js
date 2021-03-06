const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Purifycss = require('purifycss-webpack');
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devtool: '#source-map',
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.NamedChunksPlugin(),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:8].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    // new Purifycss({
    //   paths: glob.sync([
    //     path.join(__dirname, '../src/view/*.html'),
    //     path.join(__dirname, '../src/static/*.js')
    //   ])
    // }),
    new HtmlInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    }),
    new CleanWebpackPlugin(
      ['dist'],
      {
          root: path.join(__dirname, '..'), //根目录
          verbose:  true, //开启在控制台输出信息
          dry: false //启用删除文件
      }
    )
  ]
}