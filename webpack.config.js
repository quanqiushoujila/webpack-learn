const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const glob = require('glob-all');

const PurifyCss = require('purifycss-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const STATIC = '/static'

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
    app: './src/static/js/app.js',
    vendor: ['jquery'] // 第三方模块
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/bundle.[name].[hash:5].js',
    publicPath: '/dist/',
    chunkFilename: '[name].chunkName.js'
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
        /*use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {minimize: false}},
          {
            loader: 'postcss-loader', 
            options: {
              ident: 'postcss', 
              plugins: [require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true,basePath: '../'})]
            }
          },
          {loader: 'sass-loader'}
        ]*/
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {minimize: false}},
            {
              loader: 'postcss-loader', 
              options: {
                ident: 'postcss', 
                plugins: [
                  require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true,basePath: '../'}),
                  require('autoprefixer')()
                ]
              }
            },
            {loader: 'sass-loader'}
          ]
        })
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        use: [
          {loader: 'url-loader?limit=1000&name=[name].[ext]&outputPath=/static/img/'},
          /*{
            loader: 'url-loader',
            options: {
              name: '[name].[hash:5].[ext]',
              limit: 1000,
              useRelativePath: true,
              publicPath: 'dist/',
              outputPath: 'dist/'
            }
          },*/
          {loader: 'img-loader', options: {pngquant: {quality: 80}}}
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        loader: 'url-loader?limit=1000&name=static/font/[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'html-loader', options: {attrs: ['img:src', 'img:data-src']}
      },
      {
        test: /\.string$/, 
        loader: 'html-loader'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    // inline: false,
    // https:,
    // historyApiFallback: true, // 任意的跳转或404响应可以指向 index.html 页面
    // proxy: ,
    // lazy: ,
    // openpage: ,
    hotOnly: true,
    port: 9090,
    host: 'localhost',
    overlay: true,
    contentBase: path.join(__dirname), // 本地服务器在哪个目录搭建页面，一般我们在当前目录即可；
    // publicPath: './dist/view/'
    // compress: true, // 服务器返回浏览器的时候是否启动gzip压缩
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
      'img': resolve('src/static/img/'),
      'css': resolve('src/static/css/'),
      'font': resolve('src/static/font/'),
      'js': resolve('src/static/js/'),
      'scss': resolve('src/static/scss/'),
      'lib': resolve('src/static/lib/')
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:5].css'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 2 // (模块必须被2个 入口chunk 共享)
    //   // chunks: ["pageA", "pageB"], // (只使用这些 入口chunk)
    // }),
    new PurifyCss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/static/*.js')
      ])
    }),
    // new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
      // mobile: true,
      // chunks : ['common', name],
      // chunks: ['app'],
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeAttributeQuotes: true
      // },
    })
  ]
}