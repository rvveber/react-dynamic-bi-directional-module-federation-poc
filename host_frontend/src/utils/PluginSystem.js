import React, { lazy, Suspense, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { loadRemote, init } from '@module-federation/runtime';

class PluginSystemManager {
  constructor() {
    this.plugins = new Map();
    this.injectedPlugins = new Map();
  }

  async initialize() {
    try {
      // First fetch plugins configuration to get remote URLs
      const pluginsResponse = await fetch('http://localhost:3000/plugins.json');
      const pluginsConfig = await pluginsResponse.json();
      
      // Extract unique remote configurations from plugins
      const remoteConfigs = this.extractRemoteConfigs(pluginsConfig);
      
      // Initialize module federation with dynamic remotes
      await init({
        name: 'host_frontend',
        remotes: remoteConfigs
      });
      
      await this.loadPlugins(pluginsConfig);
      this.processAutoInjections();
      
    } catch (error) {
      console.error('Failed to initialize Plugin System:', error);
      throw error;
    }
  }

  extractRemoteConfigs(pluginsConfig) {
    const remoteMap = new Map();
    
    pluginsConfig.plugins.forEach(plugin => {
      if (!remoteMap.has(plugin.scope_name)) {
        remoteMap.set(plugin.scope_name, {
          name: plugin.scope_name,
          entry: plugin.remote_url
        });
      }
    });
    
    return Array.from(remoteMap.values());
  }

  async loadPlugins(pluginsConfig) {
    for (const plugin of pluginsConfig.plugins) {
      const normalizedPlugin = {
        id: plugin.id,
        name: plugin.name,
        scope: plugin.scope_name,
        module: plugin.module_name, 
        injection: plugin.injection_config
      };

      this.plugins.set(normalizedPlugin.id, normalizedPlugin);
    }
  }

  createPluginComponent(plugin) {
    const PluginComponent = lazy(() => {
      return loadRemote(`${plugin.scope}/${plugin.module}`).catch(err => {
        return { 
          default: () => createElement('div', {
            style: { 
              padding: '12px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              color: '#c62828',
              fontSize: '14px'
            }
          }, `Error loading ${plugin.name}`)
        };
      });
    });

    return () => createElement(Suspense, {
      fallback: createElement('div', {
        style: {
          padding: '12px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#666'
        }
      }, `Loading ${plugin.name}...`)
    }, createElement(PluginComponent));
  }

  processAutoInjections() {
    setTimeout(() => {
      this.plugins.forEach(plugin => {
        this.injectPlugin(plugin);
      });
    }, 100);
  }

  injectPlugin(plugin) {
    const targetElements = document.querySelectorAll(plugin.injection.target_selector);
    
    targetElements.forEach((targetElement, index) => {
      const injectionKey = `${plugin.id}-${index}`;
      
      if (this.injectedPlugins.has(injectionKey)) {
        return;
      }
      
      this.performInjection(plugin, targetElement, injectionKey);
    });
  }

  performInjection(plugin, targetElement, injectionKey) {
    const PluginComponent = this.createPluginComponent(plugin);
    
    const container = document.createElement('div');
    container.setAttribute('data-plugin-id', plugin.id);
    
    switch (plugin.injection.injection_position) {
      case 'before':
        if (targetElement.parentNode) {
          targetElement.parentNode.insertBefore(container, targetElement);
        }
        break;
      case 'after':
        if (targetElement.parentNode) {
          if (targetElement.nextSibling) {
            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
          } else {
            targetElement.parentNode.appendChild(container);
          }
        }
        break;
      case 'prepend':
        if (targetElement.firstChild) {
          targetElement.insertBefore(container, targetElement.firstChild);
        } else {
          targetElement.appendChild(container);
        }
        break;
      case 'append':
        targetElement.appendChild(container);
        break;
      case 'replace':
        if (targetElement.parentNode) {
          targetElement.parentNode.replaceChild(container, targetElement);
        }
        break;
    }
    
    const root = createRoot(container);
    root.render(createElement(PluginComponent));
    
    this.injectedPlugins.set(injectionKey, {
      plugin,
      targetElement,
      container,
      root
    });
  }

  cleanup() {
    this.injectedPlugins.forEach(({ root, container }) => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    this.injectedPlugins.clear();
  }
}

export const pluginSystem = new PluginSystemManager();

export const initializePluginSystem = async () => {
  await pluginSystem.initialize();
};
