const webpack = require("webpack");

module.exports = function override(config) {
  // Adding fallbacks for Node.js core modules
  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      http: false, // Explicitly disable `http` module
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib")
    }
  };

  // Plugins for Buffer and process polyfills
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser"
    })
  ];

  return config;
};
