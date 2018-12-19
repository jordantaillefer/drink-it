const path = require('path')
const webpack = require('webpack')

const pkg = require('./package.json')

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const env = process.env.NODE_ENV

const plugins = []
const libraryName = pkg.name
const banner = `
   ${libraryName} - ${pkg.description}
   Version: ${pkg.version}
   Author: ${pkg.author.name}
   Url: https://github.com/${pkg.repository}
   License: ${pkg.license}
`

let outputFile

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  plugins.push(new webpack.BannerPlugin(banner))

  outputFile = `${libraryName}.min.js`
} else {
  outputFile = `${libraryName}.js`
}

module.exports = {
  entry: path.join(__dirname, `/src/${libraryName}`),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  plugins,
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  }
}
