const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (isDevelopment) => ({
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          {
            loader: isDevelopment
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
          },
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDevelopment,
							modules: {
								mode: "local",
								localIdentName: "[name]__[local]--[hash:base64:5]",
								exportLocalsConvention: "camelCaseOnly",
							},
						},
					},
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,

            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: isDevelopment
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.scss'],
  },
});
