
module.exports = (isDevelopment) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: isDevelopment ? 'development' : 'production',
});
