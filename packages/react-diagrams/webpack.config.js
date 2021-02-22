const path = require('path');
var nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const images = require('../../.webpack/images.config');
const scripts = require('../../.webpack/scripts.config');
const styles = require('../../.webpack/styles.config');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  entry: path.join(__dirname, './src/index.ts'),
  target: 'node',
  devtool: false,
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    library: '@uxflow/engine',
    libraryTarget: 'umd',
  },
  plugins: [new CleanWebpackPlugin()],
};

module.exports = merge(
  config,
  images(),
  scripts(isDevelopment),
  styles(isDevelopment),
);
