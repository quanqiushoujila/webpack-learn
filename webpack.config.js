const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const glob = require('glob-all')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSS = require('purifycss-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/js/app.js'
    // 'pageA': './src/js/pageA.js',
    // 'pageB': './src/js/pageB.js',
    // 'vendor': ['jquery']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: './dist',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].chunk.[hash:5].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true // 是否压缩
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        // 这里用了样式分离出来的插件，如果不想分离出来，可以直接这样写 loader:'style!css!sass'
        loader: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: false // 是否压缩
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-sprites')({
                    spritePath: 'dist/img/sprite', // 原始大小的雪碧图放置位置
                    retina: true // 是否识别分辨率标识
                  }),
                  require('autoprefixer')()
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        }) 
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        use: [
          /*{
            loader: 'file-loader',
            options: {
              publicPath: '',
              output: 'dist/',
              useRelativePath: true
            }
          },*/
          {
            loader: 'url-loader?limit=1000&name=img/[name][hash:5].[ext]',
            // options: {
            //   name: '[name][hash:5].[ext]',
            //   limit: 4000,
            //   publicPath: '',
            //   output: 'dist/',
            //   useRelativePath: true
            // }
          },
          {
            loader: 'img-loader',
            options: {
              pngquant: {
                quality: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader?limit=1000&name=font/[name][hash:5].[ext]',
            // options: {
            //   name: '[name][hash:5].[ext]',
            //   limit: 1000,
            //   publicPath: '',
            //   output: 'dist/'
            // }
          }
        ]
      }
    ]
  },
  // resolve: {
  //   extensions: ['.js'],
  //   alias: {
  //     '@': resolve('src')
  //   }
  // },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.[hash:5].css'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 2, // 使用2次及2次以上时提取公共代码
    //   // chunks: ['pageA', 'pageB']
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'mainfest'],
    //   minChunks: Infinity
    // }),
    
    new webpack.optimize.UglifyJsPlugin(),
    // new PurifyCSS({
    //   paths: glob.sync([
    //     path.join(__dirname, './*.html'),
    //     path.join(__dirname, './src/*.js')
    //   ])
    // })
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
    })
  ]
}
