const path = require('path');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');


module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3002/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'plugin_frontend',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/components/Widget',
        './HostDataWidget': './src/components/HostDataWidget',
        './HostCardWidget': './src/components/HostCardWidget',
        './HostCounterWidget': './src/components/HostCounterWidget',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        '@tanstack/react-query': { singleton: true, eager: true },
      },
      remotes: {
        host_frontend: 'host_frontend@/remoteEntry.js',
      },
    }),
  ],
  devServer: {
    port: 3002,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
