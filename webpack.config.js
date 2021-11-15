const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve('dist'),
    filename: 'easyannotation.min.js',
    libraryTarget: 'umd',
    library: 'easyannotation',
    umdNamedDefine: true,
    libraryExport: 'default'
  },
  optimization: {
    minimize: true
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

  ],
  resolve: {
    extensions: ['.js', '.ts'],
  }
};