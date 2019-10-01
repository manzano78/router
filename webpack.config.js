const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, './src'),

  stats: {
    // Add asset Information
    assets: false,

    // Add information about cached (not built) modules
    cached: false,

    // Show cached assets (setting this to `false` only shows emitted files)
    cachedAssets: false,

    // Add children information
    children: false,

    // Display the entry points with the corresponding bundles
    entrypoints: false,

    // Add errors
    errors: true,

    // Add details to errors (like resolving log)
    errorDetails: true,

    // Add the hash of the compilation
    hash: false,

    // Add built modules information
    modules: false,

    // Add webpack version information
    version: false,

    // Add warnings
    warnings: true
  },

  entry: {
    /*
     * index.tsx represents the entry point to our application. Webpack will
     * recursively go through every "import" statement in index.tsx and
     * efficiently build out the application's dependency tree.
     *
     * Please note that the order is important, scss before tsx
     */
    index: [
      'core-js',
      './index.ts'
    ]
  },

  /*
   * The combination of path and filename tells Webpack what name to give to
   * the final bundled JavaScript files and where to store these files.
   * The publicPath specifies the public URL address of the output files
   * when referenced in a browser.
   */
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },

  /*
   * resolve lets Webpack know in advance what file extensions we plan on
   * "import"ing into the application, and allows us to drop them in our code.
   */
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  /*
   * Add additional plugins to the compiler.
   */
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],

  module: {
    /*
     * An array of Rules which are matched to requests when modules are created.
     * These rules can modify how the module is created. They can apply loaders
     * to the module, or modify the parser.
     */
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          'awesome-typescript-loader',
          'tslint-loader'
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
