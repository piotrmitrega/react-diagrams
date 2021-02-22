module.exports = () => ({
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.svg/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.svg'],
  },
});
