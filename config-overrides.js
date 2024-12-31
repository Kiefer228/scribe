const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
      fs: false, // Browser doesn't support fs
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};
