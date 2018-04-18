const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const HtmlWepackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const productionConfig = require('./webpack.prod.conf.js');
const developmentConfig =  require('./webpack.dev.conf.js');

function resolve (dir) {
  return path.resolve(__dirname, '..', dir);
}

function getHtmlTemplate (dir, title) {
  return {
    template: `./src/view/${dir}.html`,
    filename: `view/${dir}.html`,
    title: title || '',
    inject: 'body',
    hash: true,
    mobile: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }
}

const generateConfig = env => {

  const scriptLoaders = [{loader: 'babel-loader'}].concat(
    env === 'production' ? [] :
    [{
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }]
  );
  const fileLoaders = (env, filename) => {
    return env === 'production' ? [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: `static/${filename}/`,
        }
      }
    ] : 
    [
      {
        loader: 'url-loader',
        options: {
          name: '[name].[hash:5].[ext]',
          limit: 1024,
          outputPath: `static/${filename}/`,
        }
      }
    ]
  };
  const cssLoaders = 
    [
      {loader: 'css-loader', options: {minimize: env === 'production', sourceMap: env === 'development'}}
    ].concat(
      [
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            sourceMap: env === 'development',
            plugins: [
              require('postcss-cssnext')(),
              require('autoprefixer')(),
              require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true})
            ]
          }
        }
      ]
    );
  
  const styleLoaders = env === 'production' ?
    ExtractTextPlugin.extract({
      fallback: {loader: 'style-loader', options: {sourceMap: env === 'development'}},
      use: cssLoaders
    }) :
    [{loader: 'style-loader', options: {sourceMap: env === 'development'}}].concat(
      cssLoaders
      );
  
  return {
    entry: {
      app: './src/static/js/app.js',
      vendor: ['babel-polyfill', 'jquery']
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      // publicPath: '/',
      publicPath: env === 'production' ? '/dist/' : '/',
      filename: 'static/js/[name].bundle.[hash:5].js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          // include: '/src/',
          use: [
            {loader: 'babel-loader'},
            {
              loader: 'eslint-loader',
              options: {
                formatter: require('eslint-friendly-formatter')
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: styleLoaders
        },
        {
          test: /\.scss$/,
          use: styleLoaders.concat({loader: 'sass-loader', options: {sourceMap: env === 'development'}})
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: fileLoaders(env, 'img')
        },
        {
          test: /\.(woff2?|eot|svg|ttf)$/,
          use: fileLoaders(env, 'font')
        },
        {
          test: /\.string$/,
          loader: 'html-loader'
        },
        // {
        //   test: /\.html$/,
        //   loader: 'html-loader',
        //   options: {attrs: ['img:src', 'img:data-src']}
        // }
      ]
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      alias: {
        '@': resolve('src/'),
        'view': resolve('src/view/'),
        'css': resolve('src/static/css/'),
        'scss': resolve('src/static/scss/'),
        'js': resolve('src/static/js/'),
        'img': resolve('src/static/img/'),
        'font': resolve('src/static/font/'),
        'lib': resolve('src/static/lib/'),
        'assets': resolve('src/static/assets/')
      }
    },
    devServer: {
      inline: true,
      port: 9001,
      host: 'localhost',
      hot: true,
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'dist'),
      overlay: true,
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new HtmlWepackPlugin(getHtmlTemplate('index', '首页')),
      // new webpack.DefinePlugin({
      //   $: 'jquery'
      // })
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig;
  return merge(generateConfig(env), config);
}