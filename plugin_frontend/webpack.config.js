const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: './dist',
    port: 3002,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'plugin_frontend',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/components/Widget',
        './HostConsumerWidget': './src/components/HostConsumerWidget',
        './AuthAwareWidget': './src/components/AuthAwareWidget',
      },
      remotes: {
        host_frontend: 'host_frontend@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
      runtimePlugins: ['./src/bidirectional-plugin.js'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
