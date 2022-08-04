module.exports = [
  {
    target: 'browserslist',
    entry: './src/index',
    output: {
      path: __dirname + '/browser',
      filename: 'layer-request.min.js',
      library: 'layer-request',
      libraryTarget: 'umd',
    },

    resolve: {
      extensions: ['.ts', '.js'],
      fallback: { 'buffer': false },
    },

    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
      ],
    },
  },
]
