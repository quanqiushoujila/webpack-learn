const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
  entry: {
    app: './src/js/app.js'
    // 'pageA': './src/js/pageA.js',
    // 'pageB': './src/js/pageB.js',
    // 'vendor': ['jquery']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
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
      // {
      //   test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
      //   loader: 'url-loader?limit=1000*name=image/[name].[ext]'
      // }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2, // 使用2次及2次以上时提取公共代码
      // chunks: ['pageA', 'pageB']
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'mainfest'],
    //   minChunks: Infinity
    // }),
    
    new ExtractTextPlugin({
      filename: '[name].min.css'
    }),
    new webpack.optimize.uglifyJsPlugin(),
    new PurifyCSS({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    })
  ]
}
