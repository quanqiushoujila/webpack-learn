const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');
const autoprefixer = require('autoprefixer');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWepackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Purifycss = require('purifycss-webpack');
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin');

function resolve (filepath) {
  return path.resolve(__dirname, filepath);
}

function getHtmlTemplate (name) {
  return {
    template: `./src/view/${name}.html`,
    filename: `view/${name}.html`,
    inject: true,
    hash: true,
    mobile: true,
    // minify: {
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   removeAttributeQuotes: true
    // },
  }
}

module.exports = {
  entry: {
    app: './src/static/js/app.js',
    vendor: ['jquery'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'static/js/[name].bundle.[hash:5].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader!eslint-loader'
       /* use: [
          {
            loader: 'babel-loader',
            exclude: '/node_modules/'
          },
          {
            loader: 'eslint-loader',
            exclude: '/node_modules/',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]*/
      },
      {
        test: /\.css$/,
        /*use: ExtractTextPlugin.extract({
          fallback: {loader: 'style-loader', options: {sourceMap: true}},
          use: [
            {loader: 'css-loader', options: {minimize: true, sourceMap: true}},
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true,basePath: '../'}),
                  require('autoprefixer')()
                ]
              }
            }
          ]
        })*/
        use: [
          {loader: 'style-loader', options: {sourceMap: true}},
          {loader: 'css-loader', options: {minimize: true, sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('postcss-sprites')({spritePath: '../dist/static/img/sprites', retina: true}),
                require('autoprefixer')()
              ]
            }
          }
        ]
        // loader: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        /*use: ExtractTextPlugin.extract({
          fallback: {loader: 'style-loader', options: {sourceMap: true}},
          use: [
            {loader: 'css-loader', options: {minimize: true, sourceMap: true}},
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss', 
                plugins: [
                  require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true}),
                  require('autoprefixer')()
                ]
              }
            },
            {loader: 'sass-loader', options: {sourceMap: true}}
          ]
        })*/
        use: [
          {loader: 'style-loader', options: {sourceMap: true}},
          {loader: 'css-loader', options: {minimize: true, sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('postcss-sprites')({spritePath: '../dist/static/img/sprites', retina: true}),
                require('autoprefixer')()
              ]
            }
          },
          {loader: 'sass-loader', options: {sourceMap: true}}
        ]
        // loader: ['style-loader', 'css-loader', 'postcss-loader', 'scss-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            // loader: 'url-loader?limit=1024&name=/static/img/[name].[ext]', 
            // options: {publicPath: ''}
            // loader: 'url-loader',
            // options: {
            //   name: '[name].[ext]',
            //   limit: 1024,
            //   outputPath: 'static/img/',
            // }
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/font/',
            }
          },
          {
            loader: 'img-loader', 
            options: {
              pngquant: {quality: 80}
            }
          }
        ]
        // loader: ['url-loader?limit=1024&name=[name].[ext]&outputPath=src/static/img/', 'img-loader']
      },
      {
        test: /\.(woff2?|eot|svg|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/font/',
        }
        /*loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          limit: 1024,
          outputPath: 'static/font/',
        }*/
        // loader: 'url-loader?limit=1024&name=/static/font/[name].[ext]',
        // options: {publicPath: ''}
      },
      {
        test: /\.string$/,
        loader: 'html-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {attrs: ['img:src', 'img:data-src']}
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolve('../src/'),
      'view': resolve('../src/view/'),
      'css': resolve('../src/static/css/'),
      'scss': resolve('../src/static/scss/'),
      'js': resolve('../src/static/js/'),
      'img': resolve('../src/static/img/'),
      'font': resolve('../src/static/font/'),
      'lib': resolve('../src/static/lib/'),
      'assets': resolve('../src/static/assets/')
    }
  },
  devServer: {
    port: 9999,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    overlay: true,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/[name].[hash:5].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
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
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new HtmlWepackPlugin(getHtmlTemplate('index')),
    new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
  ]
}