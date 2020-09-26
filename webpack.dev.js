const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve('dist'),
    filename: 'easyannotation.min.js',
    libraryTarget: 'umd',
    library: 'easyannotation'
  },
  optimization: {
    minimize: false
  },

  devServer: {
    contentBase: `${__dirname}/`,
    disableHostCheck: true,
    host: 'localhost',
    port: 3005
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /.*\.svg$/,
        loaders: ['svg-inline-loader']
      },
      {
        test: /.*\.css$/,
        use: [
            'style-loader',
            'css-loader'
        ]
      }
    ],
  },
  plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        inject: true,
        template: path.resolve(__dirname, 'index.html'),
      })
  ],
  resolve: {
    extensions: ['.js', '.ts'],
  }
};