# React Dynamic Runtime Module Federation POC

This proof-of-concept demonstrates a powerful, dynamic, and bi-directional plugin architecture using Module Federation with React and Next.js. It serves as a template for building highly extensible applications where the host and plugins can share components, state, and logic at runtime, without requiring a rebuild of the host application.

## Core Concepts

- **Dynamic Loading**: Plugins are loaded at runtime based on a JSON configuration. The host application has no knowledge of the plugins at build time.
- **Bi-Directional Sharing**:
    - **Host to Plugin**: The host exposes components (`Card`), state management contexts (`CounterContext`), and even its core data layer (`queryClient`) for plugins to use.
    - **Plugin to Host**: Plugins are injected into the host's DOM at specified locations.
- **Shared React Instance**: By configuring React as a `singleton`, both the host and the plugins use the same instance of the React library, enabling seamless integration of state and context.

## How to Run the Demo

1.  **Prerequisites**: Ensure you have Node.js (v18+) and npm installed.
2.  **Start the Application**:
    ```bash
    ./demo.sh
    ```
    This script handles everything: it installs dependencies, builds both the host and plugin applications, and starts all the necessary services.

3.  **Open the Host**: Navigate to `http://localhost:3001` in your browser.

You will see the host application immediately, and after a 5-second countdown, the plugins will be dynamically fetched and injected into the page.

## How to Develop a Plugin

Developing a plugin for this system is straightforward. Here's a guide based on the existing `HostDataWidget`.

### 1. Create the Plugin Component

Create your component in the `plugin_frontend/src/components` directory. This component can import and use anything the host has exposed.

**Example: `plugin_frontend/src/components/HostDataWidget.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { useRemoteModule } from '../hooks/useRemoteModule';
import type { QueryClient } from '@tanstack/react-query';

const HostDataWidget: React.FC = () => {
  // 1. Import the host's queryClient
  const { remoteModule: HostLib } = useRemoteModule({
    remote: 'host_frontend',
    component: 'queryClient',
  });

  const [message, setMessage] = useState('Waiting for host data...');

  useEffect(() => {
    if (HostLib?.queryClient) {
      const queryClient: QueryClient = HostLib.queryClient;

      // 2. Read initial data from the host's cache
      const authData: any = queryClient.getQueryData(['auth', 'status']);
      if (authData) {
        setMessage(authData.message);
      }

      // 3. Subscribe to changes for reactivity
      const unsubscribe = queryClient.getQueryCache().subscribe(event => {
        if (event.type === 'updated' && event.query.queryKey[0] === 'auth') {
          setMessage((event.query.state.data as any)?.message);
        }
      });

      return () => unsubscribe();
    }
  }, [HostLib]);

  return (
    <div>
      <h4>My New Plugin</h4>
      <p>Message from host: {message}</p>
    </div>
  );
};

export default HostDataWidget;
```

### 2. Expose the Plugin & Configure Sharing

To make your plugin's components available to the host and to enable your plugin to consume components from the host, you must configure the Module Federation plugin in `plugin_frontend/webpack.config.js`.

This configuration is the key to bi-directional sharing. Below is a commented example explaining each part:

```javascript
// plugin_frontend/webpack.config.js
new ModuleFederationPlugin({
  // A unique name for the plugin remote. This is used by the host to identify it.
  name: 'plugin_frontend',

  // The filename for the remote entry, which is the manifest of the plugin.
  filename: 'remoteEntry.js',

  // An object where keys are the module names the host will use to import,
  // and values are the paths to the actual components.
  exposes: {
    './Widget': './src/components/Widget',
    './HostDataWidget': './src/components/HostDataWidget',
    './HostCardWidget': './src/components/HostCardWidget',
    './HostCounterWidget': './src/components/HostCounterWidget',
  },

  // Defines shared libraries to ensure singletons (e.g., one instance of React).
  shared: {
    // For each library, we declare our intent to share.
    // `singleton: true` ensures that only one instance of this library
    // is loaded in the entire application (the host's version).
    // This is critical for libraries like React that have a global state.
    //
    // Why does the plugin need this?
    // 1. To Consume: It tells Webpack "I need React, but please check if the
    //    host is already providing a singleton version before you bundle my own."
    // 2. To Provide: It acts as a fallback. If the plugin were run standalone,
    //    it would use its own copy.
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    '@tanstack/react-query': { singleton: true, eager: true },
  },
}),
```

It is crucial that the host application (`host_frontend/next.config.js`) has a corresponding `shared` configuration to act as the provider for these singleton libraries.

### 3. Configure the Plugin for Injection

The `plugins.json` tells it where to find plugins and how to load them.
The host application should expect to find this file relative to its web root, so you need to ensure it is served correctly.

In the demo, if we build the host app, `public/plugins.json` lands in the web root e.g., `http://localhost:3001/plugins.json`.
In k8s, you would use a ConfigMap, it allows you to place this file into the web root without building the host application.

```jsonc
// host_frontend/public/plugins.json
[
  {
    // A unique identifier for this specific plugin instance.
    "id": "demonstrate-auth-access",

    // The full URL to the remoteEntry.js file of the plugin.
    "remote_url": "http://localhost:3002/remoteEntry.js",

    // The `name` defined in the plugin's Module Federation configuration.
    // This acts as the remote's scope.
    "remote_name": "plugin_frontend",

    // The key from the `exposes` object in the plugin's webpack config.
    // This is the identifier for the module you want to load.
    //
    // So if in the hosts webpack.config.js you have:
    //   exposes: { './HostDataWidget': ... }
    "remote_component": "HostDataWidget",

    // Specifies where and how the plugin should be injected into the host DOM.
    "injection_config": {
      // A CSS selector for the DOM element where the plugin component will be rendered.
      "target_selector": "main",
      // The position where the plugin will be injected relative to the target selector. before|after|replace|prepend|append.
      "injection_position": "before",
    }
  }
]
```

### 4. Styling Your Plugin

Styling with separate CSS files is possible and recommended to keep your plugin's styles isolated from the host application. Here's how to do it:

1.  **Import Styles**: Import your CSS file in a top-level plugin component that is exposed to the host. For example, in `HostDataWidget.tsx`, you would add:
    ```tsx
    import '../styles/components.css';
    ```
    When the host loads your plugin, Webpack will automatically inject these styles into the document's `<head>`.

2.  **Scope Your Styles**: To prevent CSS conflicts, scope all of your plugin's styles under a parent class. In this POC, we use `.plugin-scope`.
    ```css
    /* plugin_frontend/src/styles/components.css */
    .plugin-scope .my-plugin-button {
      background-color: blue;
    }
    ```

3.  **Apply the Scope**: Use a wrapper component to apply the scoping class to all of your plugin's UI. We have created `PluginWidgetWrapper` for this purpose.

### 5. Restart and Test

Run `./demo.sh` again to rebuild the plugin and restart the servers. Your new widget will now be loaded and injected into the host application.

## Architecture: Demo vs. Production

This proof-of-concept is structured to clearly separate the production-ready plugin system from the demo-specific features. This makes it easy to understand the core logic and adapt it for a real-world application.

### The Core Logic (Production-Ready)

-   **File:** `host_frontend/src/utils/PluginSystemProvider.tsx`
-   **Component:** `PluginSystemProvider`

This component contains the essential, production-grade logic for the plugin system. Its responsibilities are:
1.  Fetching the `plugins.json` configuration.
2.  Dynamically loading the remote plugin files (`remoteEntry.js`).
3.  Injecting the specified plugin components into the host application's DOM.

It is lean, efficient, and has no knowledge of the demo's countdown timer. To use this system in your own application, you would copy and integrate this provider.

### The Demo Wrapper

-   **File:** `host_frontend/src/utils/PluginSystemDemoProvider.tsx`
-   **Component:** `PluginSystemDemoProvider`

This component is a wrapper created **exclusively for this demo**. It serves one purpose: to visually demonstrate that the plugins are loaded dynamically at runtime, *after* the main host application is already interactive.

It works by:
1.  Immediately rendering the host application.
2.  Displaying a 4-second countdown overlay.
3.  **Only then**, it uses the real `PluginSystemProvider` to load and inject the plugins.

This delay is purely for demonstration and should **not** be used in a production environment.

### How to Switch to Production Mode

In a real application, you would want plugins to load as quickly as possible. To do this, you would use the `PluginSystemProvider` directly.

Find this code in `host_frontend/pages/_app.tsx`:

```tsx
// Using the demo provider
import { PluginSystemDemoProvider } from '../src/utils/PluginSystemDemoProvider';

// ...
<PluginSystemDemoProvider>
  <Component {...pageProps} />
</PluginSystemDemoProvider>
// ...
```

And change it to use the production provider:

```tsx
// Using the production provider
import { PluginSystemProvider } from '../src/utils/PluginSystemProvider';

// ...
<PluginSystemProvider>
  <Component {...pageProps} />
</PluginSystemProvider>
// ...
```

## What Can Be Shared?

### ✅ Safe to Share

- **Components**: The host can expose entire React components for plugins to render. This is the most common and robust pattern.
- **React Context**: By sharing the React instance, plugins can use hooks like `useContext` to tap directly into the host's state providers (e.g., `CounterContext`).
- **State Management Instances**: You can directly share instances of libraries like TanStack Query's `QueryClient`. This gives plugins deep, reactive access to the host's data layer.
- **Plain Functions and Objects**: Any non-hook utility functions or constants can be easily shared.

### ❌ Unsafe to Share

- **Direct Hook Calls**: You should **not** export a custom hook from the host and call it directly in a plugin. While it may seem to work if the React singleton is perfectly configured, it's a fragile pattern that can easily break if there are any mismatches, leading to the "Invalid hook call" error. The safer approach is to share a component that uses the hook, or to share the underlying data source (like the `queryClient`).

This POC demonstrates that a highly decoupled, yet deeply integrated, plugin system is achievable with modern frontend tooling.
