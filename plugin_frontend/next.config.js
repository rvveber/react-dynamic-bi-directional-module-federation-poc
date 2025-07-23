const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
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
            react: { singleton: true },
            'react-dom': { singleton: true },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
