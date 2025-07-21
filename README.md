# Dynamic Bidirectional Module Federation POC

> **A minimal, clean, and readable demonstration of dynamic bidirectional module federation using Webpack 5**

## 🎯 Overview

This project demonstrates a **minimal implementation** of dynamic bidirectional module federation where:

- **Host applications** can dynamically load plugins from a JSON configuration
- **Plugins** can dynamically import and use host components (bidirectional)
- **No manual registration** - plugins are auto-injectable with configurable positioning
- **Clean, self-documenting code** with minimal complexity

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  host_backend   │    │  host_frontend  │    │ plugin_frontend │
│    Port 3000    │    │    Port 3001    │    │    Port 3002    │
│                 │    │                 │    │                 │
│ • Express       │◄──►│ • React         │◄──►│ • React         │
│ • plugins.json  │    │ • Module Fed    │    │ • Module Fed    │
│ • CORS enabled  │    │ • Plugin System │    │ • Bidirectional │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features Demonstrated

### 🔄 Dynamic Plugin Loading
- **Auto Injection**: Plugins automatically inject into DOM based on JSON configuration
- **Multiple Positions**: `before`, `after`, `replace` injection strategies
- **No Manual Loading**: Fully automated plugin system

### 🚀 Bidirectional Module Federation
- **Host→Plugin**: Host loads plugin components dynamically
- **Plugin→Host**: Plugins import and use host components
- **Runtime Resolution**: No build-time coupling required

### 🎮 Auto-Injection Capabilities  
- **Before**: Insert plugin before target elements
- **After**: Insert plugin after target elements  
- **Replace**: Replace existing DOM elements with plugins

### 🧩 Plugin System Features
- **JSON Configuration**: Backend serves plugin config via REST API
- **Error Handling**: Graceful fallbacks when components fail to load
- **Hot Reloading**: Development-friendly with live updates
- **Standalone Mode**: Plugins can run independently or be integrated

## 🚀 Quick Start

### 1. Start All Services
```bash
./demo.sh
```

### 2. Access Applications
- **Host**: http://localhost:3001 (main application)
- **Plugin**: http://localhost:3002 (standalone plugin)
- **Backend**: http://localhost:3000 (configuration API)

### 3. Test Features
1. **Auto Injection**: Notice plugins automatically injected around the page
2. **Bidirectional**: See plugins importing host components (Header, Card)
3. **Multiple Positions**: See plugins before, after, and replacing content
4. **Standalone**: Visit localhost:3002 to see plugin running independently

## 📁 Project Structure

```
├── demo.sh                    # Service management script
├── host_backend/              # Configuration server
│   ├── server.js             # Express server
│   ├── plugins.json          # Plugin configuration
│   └── package.json
├── host_frontend/             # Main application
│   ├── src/
│   │   ├── App.js            # Main app with plugin UI
│   │   ├── components/       # Exportable host components
│   │   │   ├── Header.js     # Shared header component
│   │   │   ├── Sidebar.js    # Shared sidebar component
│   │   │   └── Card.js       # Shared card component
│   │   └── utils/
│   │       └── PluginSystem.js # Core plugin loading system
│   ├── webpack.config.js     # Module federation config
│   └── package.json
└── plugin_frontend/          # Plugin application
    ├── src/
    │   ├── Widget.js         # Basic plugin widget
    │   ├── HostConsumerWidget.js # Bidirectional widget
    │   └── bidirectional-plugin.js # Runtime plugin
    ├── webpack.config.js     # Module federation config
    └── package.json
```

## 🔧 Core Technologies

- **React 19**: Modern React with Suspense and lazy loading
- **Webpack 5**: Module Federation with @module-federation/enhanced
- **Express**: Simple REST API for configuration
- **Module Federation Runtime**: Dynamic remote loading

## 📋 Plugin Configuration

The `host_backend/plugins.json` controls plugin behavior:

```json
{
  "plugins": [
    {
      "id": "auto-injected-widget",
      "name": "Auto Injected Widget", 
      "remote_url": "http://localhost:3002/remoteEntry.js",
      "module_name": "Widget",
      "scope_name": "plugin_frontend",
      "injection_config": {
        "target_selector": "main",
        "injection_position": "after"
      }
    },
    {
      "id": "bidirectional-widget",
      "name": "Bidirectional Widget",
      "remote_url": "http://localhost:3002/remoteEntry.js",
      "module_name": "HostConsumerWidget", 
      "scope_name": "plugin_frontend",
      "injection_config": {
        "target_selector": "header",
        "injection_position": "after"
      }
    }
  ]
}
```

### Configuration Options

- **injection_position**: `before`, `after`, or `replace`
- **target_selector**: CSS selector for injection target

## 🎓 Key Learning Points

### 1. Module Federation Setup
```javascript
// Host exposes components for plugins to use
exposes: {
  './Header': './src/components/Header',
  './Sidebar': './src/components/Sidebar', 
  './Card': './src/components/Card',
}

// Plugin consumes host components
remotes: {
  host_frontend: 'host_frontend@http://localhost:3001/remoteEntry.js',
}
```

### 2. Dynamic Loading Pattern
```javascript
// Load plugin component dynamically
const PluginComponent = lazy(() => 
  loadRemote(`${plugin.scope}/${plugin.module}`)
);

// Use with Suspense for loading states
<Suspense fallback={<div>Loading...</div>}>
  <PluginComponent />
</Suspense>
```

### 3. Bidirectional Import
```javascript
// Plugin importing host components
const HostHeader = lazy(() => 
  import('host_frontend/Header')
);
```

## 🔍 What Makes This Minimal

### ❌ Removed Complexity
- **No rspack** - Uses only standard Webpack 5
- **No manual registration** - Plugins auto-register
- **No manual loading UI** - Fully automated injection system
- **No complex routing** - Simple component-based approach
- **No unnecessary styling** - Focus on functionality
- **No build-time coupling** - Pure runtime federation

### ✅ Clean Patterns
- **Self-documenting variable names** (`ensureRemoteRegistered`, `processAutoInjections`)
- **Clear separation of concerns** (PluginSystem, App, Components)
- **Minimal configuration** (Essential webpack settings only)
- **Error boundaries** (Graceful fallbacks)
- **Live examples** (Interactive widgets with state)

## 🧪 Testing the Demo

### Auto Injection System
1. Visit http://localhost:3001
2. Notice plugins automatically appear around the page
3. Check sidebar for replaced content  
4. See plugins injected after main content and header

### Bidirectional Federation
- See plugins importing and using host components (Header, Card)
- Notice how plugins seamlessly blend with host styling

### Standalone Plugin
- Visit http://localhost:3002
- See plugins running independently
- Notice graceful fallback when host components aren't available

## 🚫 Common Pitfalls Avoided

1. **Complex Build Scripts**: Simple npm start commands
2. **Manual Remote Registration**: Automatic via configuration
3. **Manual Plugin Loading UI**: Fully automated injection system
4. **Tight Coupling**: Components work independently
5. **Poor Error Handling**: Graceful fallbacks everywhere
6. **Overly Complex State**: Simple, focused component state

## 🔄 Development Workflow

1. **Start services**: `./demo.sh`
2. **Edit components**: Hot reloading works across all apps
3. **Update config**: Modify `plugins.json` and refresh
4. **Test features**: Use browser dev tools to see console logs
5. **Stop services**: Ctrl+C (auto-cleanup)

## 📚 Further Reading

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [@module-federation/enhanced](https://www.npmjs.com/package/@module-federation/enhanced)
- [React Suspense and Lazy](https://react.dev/reference/react/Suspense)

---

**🎉 This POC successfully demonstrates minimal, clean, and readable dynamic bidirectional module federation!**
