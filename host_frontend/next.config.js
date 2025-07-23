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
          name: 'host_frontend',
          filename: 'remoteEntry.js',
          exposes: {
            './Header': './src/components/Header',
            './Sidebar': './src/components/Sidebar',
            './Card': './src/components/Card',
            './CounterContext': './src/contexts/CounterContext',
            './AuthContext': './src/contexts/AuthContext',
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
