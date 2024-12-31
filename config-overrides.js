const webpack = require("webpack");

module.exports = function override(config) {
  // Adding fallbacks for Node.js core modules
  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"), // Added fallback for stream
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      util: require.resolve("util/"),
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib"),
    },
  };

  // Plugins for Buffer and process polyfills
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];

  // Ensure correct handling of polyfill dependencies
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // Allow importing without the extension
    },
  });

  return config;
};
