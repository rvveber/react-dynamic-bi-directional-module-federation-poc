const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3004,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
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
      name: 'app4',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget',
        './Dashboard': './src/Dashboard',
        './HeaderAction': './src/HeaderAction',
        './SidebarWidget': './src/SidebarWidget',
        './AdvancedSidebarWidget': './src/AdvancedSidebarWidget',
      },
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
      },
      runtimePlugins: ['./dynamic-bidirectional-plugin.js'],
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-aria-components': { singleton: true },
        moment: { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
