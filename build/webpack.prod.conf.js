const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Purifycss = require('purifycss-webpack');
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:5].css'
    }),
    new webpack.optimize.SplitChunksPlugin({
      chunks: 'all',
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        //打包重复出现的代码
        vendor: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: 'vendor'
        },
        //打包第三方类库
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: Infinity
        }
      }
    }),
    new webpack.optimize.RuntimeChunkPlugin({
      name: "manifest"
    }),
    // new Purifycss({
    //   paths: glob.sync([
    //     path.join(__dirname, './*.html'),
    //     path.join(__dirname, './src/static/*.js')
    //   ])
    // }),
    new HtmlInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
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