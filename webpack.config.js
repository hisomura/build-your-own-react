const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "development",
  // devtool: 'inline-source-map', // It seems to be worked without explicitly configuring this property.
  entry: { index: './src/index.ts' },
  devServer: {
    open: true,
    contentBase: path.join(__dirname, 'public'),
    compress: true
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: 'body',
    }),
  ]
}
