# Dynamic Bidirectional Module Federation POC

A production-ready demonstration of dynamic bidirectional module federation using Next.js SSG, Webpack 5, and TypeScript.

## Overview

This proof-of-concept demonstrates runtime module federation where:

- **Host applications** dynamically load plugins from JSON configuration
- **Plugins** bidirectionally import and use host components at runtime
- **Zero manual registration** - plugins auto-inject with configurable DOM positioning
- **SSG compatibility** - Static Site Generation with runtime Module Federation
- **Production-ready** - TypeScript, shared components, professional styling

## Architecture

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Host Backend  │    │  Host Frontend  │    │ Plugin Frontend │
│   (Express.js)  │◄──►│  (Next.js SSG)  │◄──►│   (Webpack 5)   │
│   Port 3000     │    │   Port 3001     │    │   Port 3002     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   plugins.json           remoteEntry.js          remoteEntry.js
   Configuration          (SSG + MF)              (Native MF)
```

### Key Features

- **SSR-Safe Module Federation**: PluginSystem handles client-side execution
- **Bidirectional Components**: Host and plugins share components at runtime
- **Auto-Injection**: Plugins inject automatically using DOM selectors
- **TypeScript**: Full type safety across host and plugin systems
- **Professional Styling**: Extracted CSS classes with shared design system

## Quick Start

```bash
# Clone and start all services
git clone <repository>
cd react-dynamic-bi-directional-module-federation-poc
./demo.sh
```

The demo script automatically:
1. Installs all dependencies
2. Builds applications
3. Starts all services (ports 3000, 3001, 3002)
4. Opens http://localhost:3001 to view the demo

## Project Structure

```
├── demo.sh                   # Complete demo runner
├── host_backend/             # Configuration API server
│   ├── server.js            # Express server serving plugins.json
│   └── plugins.json         # Plugin configuration
├── host_frontend/            # Next.js SSG application
│   ├── pages/index.tsx      # Main page with plugin integration
│   ├── src/
│   │   ├── components/      # Exportable components
│   │   │   ├── Header.tsx   # Shared header component
│   │   │   ├── Sidebar.tsx  # Navigation with injection targets
│   │   │   └── Card.tsx     # Reusable card component
│   │   ├── contexts/        # React contexts
│   │   │   ├── CounterContext.tsx
│   │   │   └── AuthContext.tsx
│   │   └── utils/
│   │       └── PluginSystem.tsx # Plugin loading and injection
│   └── next.config.js       # Module Federation + SSG config
└── plugin_frontend/         # Webpack plugin application
    ├── src/
    │   └── components/      # Plugin components
    │       ├── Widget.tsx           # Basic plugin widget
    │       ├── HostCardWidget.tsx   # Uses host Card component
    │       ├── HostCounterWidget.tsx # Uses host counter state
    │       └── HostAuthWidget.tsx   # Uses host auth context
    └── webpack.config.js    # Module federation configuration
```

## Plugin Configuration

```json
{
  "plugins": [
    {
      "id": "before-first-card",
      "name": "Basic Widget",
      "module_name": "Widget",
      "scope_name": "plugin_frontend",
      "remote_url": "http://localhost:3002/remoteEntry.js",
      "injection_config": {
        "target_selector": "#first-card",
        "injection_position": "before"
      }
    }
  ]
}
```

### Injection Positions
- `before` - Insert before target element
- `after` - Insert after target element
- `replace` - Replace target element
- `prepend` - Insert as first child
- `append` - Insert as last child

## Module Federation Configuration

### Host (Next.js)
```javascript
// next.config.js
new NextFederationPlugin({
  name: 'host_frontend',
  exposes: {
    './Header': './src/components/Header',
    './Card': './src/components/Card',
    './AuthContext': './src/contexts/AuthContext',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

### Plugin (Webpack)
```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'plugin_frontend',
  exposes: {
    './Widget': './src/components/Widget',
    './HostCardWidget': './src/components/HostCardWidget',
  },
  remotes: {
    host_frontend: 'host_frontend@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

## Testing the Demo

1. **Auto Injection**: Visit http://localhost:3001 and wait for 5-second countdown
2. **Plugin Loading**: Plugins automatically inject into designated DOM positions
3. **Bidirectional Federation**: Plugin widgets use host components and contexts
4. **Error Handling**: Test with invalid plugin URLs for graceful fallbacks

## Production Deployment

### Host Frontend (SSG)
```bash
npm run build    # Generates static files in 'out/'
# Deploy 'out/' folder to CDN or static hosting
```

### Plugin Frontend
```bash
npm run build    # Generates webpack dist/ with remoteEntry.js
# Deploy 'dist/' folder to serve remoteEntry.js
```

### Configuration
- Update plugin URLs in `plugins.json` for production
- Configure CORS headers for cross-origin module federation
- Implement proper CSP headers for security

## Performance Considerations

- **Bundle Optimization**: Shared dependencies prevent duplication
- **Lazy Loading**: Plugins loaded on-demand with visual feedback
- **Error Boundaries**: Failed plugins don't crash the host application
- **Caching**: Static builds enable efficient CDN caching

## Use Cases

- **CMS Plugin Systems**: Dynamic content widgets
- **Dashboard Extensions**: Third-party dashboard widgets
- **Micro-frontends**: Independent team deployments
- **White-label Solutions**: Customer-specific customizations

## Technical Achievements

- **Runtime Module Federation**: No build-time coupling between applications
- **SSG Compatibility**: Static site generation with dynamic plugin loading
- **Type Safety**: Full TypeScript support across federated boundaries
- **Production Ready**: Error handling, loading states, and professional UI
