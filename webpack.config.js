const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const STATIC = '/static'

module.exports = {
  entry: {
    app: './src/static/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/js/[name].[hash:5].js',
    // publicPath: '/',
    chunkFilename: '[name].chunkName.[hash:5].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {loader: 'babel-loader'}
        ],
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({
          fallback: {loader: 'style-loader'},
          use: [
            {loader: 'css-loader', options: {minimize: false}}
          ],
        }),
        include: path.join(__dirname, 'src'),
        exclude: '/node_modules/'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {minimize: false}},
            {
              loader: 'postcss-loader', 
              options: {
                ident: 'postcss', 
                plugins: [require('postcss-sprites')({spritePath: 'static/img/sprites', retina: true,})]
              }
            },
            {loader: 'sass-loader'}
          ]
        })
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:5].[ext]',
              limit: 1000,
              useRelativePath: true,
              publicPath: '',
              outputPath: 'dist/'
            }
          },
          {loader: 'img-loader', options: {pngquant: {quality: 80}}}
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {loader: 'url-loader?limit=1000&name=static/font/[name].[ext]'}
        ]
      }
    ]
  },
  devServer: {
    port: 9090,
    host: 'localhost',
    overlay: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 服务器返回浏览器的时候是否启动gzip压缩
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:5].css'
    }),
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    }),*/
    // new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new HtmlWebpackPlugin({
      filename: 'view/index.html',
      template: './src/view/index.html',
      inject: true,
    })
  ]
}