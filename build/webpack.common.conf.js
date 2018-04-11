const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const HtmlWepackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const productionConfig = require('./webpack.prod.conf.js');
const developmentConfig =  require('./webpack.dev.conf.js');

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

const generateConfig = env => {
  const scriptLoaders = 'babel-loader'.concat(
    env === 'production' ? 
    '':
    '!eslint-loader'
  );

  const cssLoaders = 
    [
      {loader: 'css-loader', options: {minimize: env === 'production', sourceMap: env === 'development'}}
    ].concat(
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: env === 'development',
          plugins: [
            require('postcss-cssnext')(),
            require('autoprefixer')()
          ].concat(env === 'production' ? 
            [] :
            [require('postcss-sprites')({spritePath: '/dist/static/img/sprites', retina: true})]
          )
        }
      }
    );
  
  const styleLoaders = env === 'production' ?
    ExtractTextPlugin.extract({
      fallback: {loader: 'style-loader', options: {sourceMap: env === 'development'}},
      use: cssLoaders
    }) :
    [{loader: 'style-loader', options: {sourceMap: env === 'development'}}].concat(
      cssLoaders
      )
    ;
  
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
  }

  return {
    entry: {
      app: './src/static/js/app.js',
      vendor: ['jquery'],
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      filename: 'static/js/[name].bundle.[hash:5].js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: scriptLoaders
        },
        {
          test: /\.css$/,
          use: styleLoaders
        },
        {
          test: /\.scss$/,
          use: styleLoaders.concat([{loader: 'sass-loader', options: {sourceMap: env === 'development'}}])
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: fileLoaders(env, 'img').concat(env === 'production' ? 
            [{
                loader: 'img-loader', 
                options: {
                  pngquant: {quality: 80}
                }
              }] : []
          )
        },
        {
          test: /\.(woff2?|eot|svg|ttf)$/,
          use: fileLoaders(env, 'font')
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
      extensions: ['js'],
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
      contentBase: path.join(__dirname, '../dist'),
      overlay: true
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'static/css/[name].[hash:5].css'
      }),
      new CleanWebpackPlugin([path.join(__dirname, '../dist')]),
      new HtmlWepackPlugin(getHtmlTemplate('index'))
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig;
  return merge(generateConfig(env), config);
}