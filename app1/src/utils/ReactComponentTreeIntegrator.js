// Universal React Component Tree Integrator with CSS Selector-Based Injection
// Uses React 19 advanced features for dynamic component injection
import React, { lazy, Suspense, useEffect, useRef, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { loadRemote, registerRemotes } from '@module-federation/runtime';

// Advanced React Tree Plugin System using React 19 capabilities
class UniversalReactTreeIntegrator {
  constructor() {
    this.plugins = new Map();
    this.manualPlugins = new Map();
    this.elementToFiberMap = new WeakMap();
    this.fiberToElementMap = new WeakMap();
    this.elementMetadata = new WeakMap(); // Store metadata separately from elements
    this.injectionObserver = null;
    this.originalCreateElement = null;
    this.isPatched = false;
    this.domObserver = null;
    this.injectedElements = new Map();
    this.registeredRemotes = new Set(); // Track registered remotes
  }

  // Initialize the universal injection system
  initialize() {
    if (this.isPatched) return;
    
    console.log('🚀 Initializing Universal React Tree Integrator with CSS Selectors...');
    
    // Store original createElement
    this.originalCreateElement = React.createElement;
    
    // Patch React.createElement to track component-to-DOM mapping
    React.createElement = (type, props, ...children) => {
      const element = this.originalCreateElement(type, props, ...children);
      
      // Track element creation for fiber mapping
      if (props && typeof type === 'function') {
        this.trackElementCreation(element, type);
      }
      
      return element;
    };
    
    // Set up DOM observation for dynamic injection
    this.setupDOMObserver();
    
    this.isPatched = true;
    console.log('✅ Universal React Tree Integrator initialized');
  }

  // Track element creation for React Fiber mapping
  trackElementCreation(element, componentType) {
    // Store component metadata in WeakMap to avoid modifying non-extensible React elements
    this.elementMetadata.set(element, {
      type: componentType,
      name: componentType.displayName || componentType.name,
      timestamp: Date.now()
    });
  }

  // Get element metadata
  getElementMetadata(element) {
    return this.elementMetadata.get(element);
  }

  // Setup DOM observer to detect when elements are rendered
  setupDOMObserver() {
    // Use React 19's concurrent features with DOM observation
    this.domObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processNewDOMElement(node);
          }
        });
      });
    });

    // Start observing when DOM is ready
    if (document.body) {
      this.startDOMObservation();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.startDOMObservation();
      });
    }
  }

  // Start DOM observation
  startDOMObservation() {
    this.domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
    
    // Process existing elements
    this.processExistingElements();
  }

  // Process existing DOM elements on initialization
  processExistingElements() {
    console.log('🔍 Processing existing DOM elements for injection...');
    
    // Check all current plugins for injection opportunities
    for (const plugin of this.plugins.values()) {
      if (plugin.injection && plugin.injection.selector) {
        this.processPluginInjection(plugin);
      }
    }
  }

  // Process a new DOM element for potential injection
  processNewDOMElement(element) {
    // Check if any plugins should be injected relative to this element
    for (const plugin of this.plugins.values()) {
      if (plugin.injection && plugin.injection.selector) {
        const targetElements = element.querySelectorAll ? 
          element.querySelectorAll(plugin.injection.selector) : [];
        
        // Check if the element itself matches
        if (element.matches && element.matches(plugin.injection.selector)) {
          this.injectPluginAtElement(plugin, element);
        }
        
        // Check child elements
        targetElements.forEach(targetEl => {
          this.injectPluginAtElement(plugin, targetEl);
        });
      }
    }
  }

  // Process plugin injection for a specific plugin
  processPluginInjection(plugin) {
    const targetElements = document.querySelectorAll(plugin.injection.selector);
    
    console.log(`🎯 Processing injection for ${plugin.id}:`, {
      selector: plugin.injection.selector,
      position: plugin.injection.position,
      targetElements: targetElements.length
    });
    
    targetElements.forEach(element => {
      this.injectPluginAtElement(plugin, element);
    });
  }

  // Inject a plugin at a specific DOM element
  injectPluginAtElement(plugin, targetElement) {
    const injectionKey = `${plugin.id}-${this.getElementPath(targetElement)}`;
    
    // Avoid duplicate injections
    if (this.injectedElements.has(injectionKey)) {
      return;
    }
    
    console.log(`💉 Injecting ${plugin.id} ${plugin.injection.position} element:`, targetElement);
    
    // Create the plugin component
    const pluginElement = this.createPluginComponent(plugin, injectionKey);
    
    // Inject based on position
    switch (plugin.injection.position) {
      case 'before':
        this.injectBefore(targetElement, pluginElement, injectionKey);
        break;
      case 'after':
        this.injectAfter(targetElement, pluginElement, injectionKey);
        break;
      case 'replace':
        this.injectReplace(targetElement, pluginElement, injectionKey);
        break;
      default:
        console.warn(`Unknown injection position: ${plugin.injection.position}`);
    }
    
    this.injectedElements.set(injectionKey, {
      plugin,
      targetElement,
      pluginElement,
      timestamp: Date.now()
    });
  }

  // Register a remote dynamically
  async ensureRemoteRegistered(plugin) {
    try {
      // Check if this remote is already registered
      if (!this.registeredRemotes) {
        this.registeredRemotes = new Set();
      }
      
      if (this.registeredRemotes.has(plugin.scope)) {
        return; // Already registered
      }
      
      console.log(`📡 Registering remote: ${plugin.scope} -> ${plugin.entry}`);
      
      // Register the remote
      registerRemotes([
        {
          name: plugin.scope,
          entry: plugin.entry,
        }
      ]);
      
      this.registeredRemotes.add(plugin.scope);
      console.log(`✅ Remote registered: ${plugin.scope}`);
      
    } catch (error) {
      console.error(`❌ Failed to register remote ${plugin.scope}:`, error);
      throw error;
    }
  }

  // Create a plugin component element
  createPluginComponent(plugin, key) {
    // Create a container div for the plugin
    const container = document.createElement('div');
    container.setAttribute('data-plugin-id', plugin.id);
    container.setAttribute('data-plugin-key', key);
    container.style.margin = '0.5rem 0';
    
    // Create React component for the plugin
    const PluginComponent = lazy(() => {
      console.log(`🔄 Loading plugin: ${plugin.scope}/${plugin.module}`);
      
      // Ensure remote is registered before loading
      return this.ensureRemoteRegistered(plugin).then(() => {
        return loadRemote(`${plugin.scope}/${plugin.module}`);
      }).catch(err => {
        console.error(`❌ Failed to load plugin ${plugin.id}:`, err);
        return { 
          default: () => createElement('div', {
            style: { 
              padding: '0.5rem', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              color: '#c62828'
            }
          }, `Error loading ${plugin.name}: ${err.message}`)
        };
      });
    });

    // Create React root using React 19's createRoot
    const root = createRoot(container);
    root.render(
      createElement(Suspense, {
        fallback: createElement('div', {
          style: {
            padding: '0.5rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontStyle: 'italic'
          }
        }, `Loading ${plugin.name}...`)
      }, createElement(PluginComponent))
    );
    
    return container;
  }

  // Inject plugin before target element
  injectBefore(targetElement, pluginElement, key) {
    if (targetElement.parentNode) {
      targetElement.parentNode.insertBefore(pluginElement, targetElement);
      console.log(`✅ Injected ${key} before target element`);
    }
  }

  // Inject plugin after target element
  injectAfter(targetElement, pluginElement, key) {
    if (targetElement.parentNode) {
      if (targetElement.nextSibling) {
        targetElement.parentNode.insertBefore(pluginElement, targetElement.nextSibling);
      } else {
        targetElement.parentNode.appendChild(pluginElement);
      }
      console.log(`✅ Injected ${key} after target element`);
    }
  }

  // Replace target element with plugin
  injectReplace(targetElement, pluginElement, key) {
    if (targetElement.parentNode) {
      targetElement.parentNode.replaceChild(pluginElement, targetElement);
      console.log(`✅ Replaced target element with ${key}`);
    }
  }

  // Get a unique path for a DOM element
  getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      // Add position if there are siblings
      const siblings = current.parentNode ? 
        Array.from(current.parentNode.children).filter(el => el.tagName === current.tagName) : [];
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current);
        selector += `:nth-of-type(${index + 1})`;
      }
      
      path.unshift(selector);
      current = current.parentNode;
    }
    
    return path.join(' > ');
  }

  // Add plugin to the system
  addPlugin(plugin) {
    console.log('➕ Adding plugin for CSS selector injection:', plugin.id);
    this.plugins.set(plugin.id, plugin);
    
    // If already initialized, process this plugin immediately
    if (this.isPatched && plugin.injection && plugin.injection.selector) {
      setTimeout(() => this.processPluginInjection(plugin), 100);
    }
  }

  // Remove plugin from the system
  removePlugin(pluginId) {
    console.log('➖ Removing plugin:', pluginId);
    
    // Remove all injected elements for this plugin
    for (const [key, injection] of this.injectedElements.entries()) {
      if (injection.plugin.id === pluginId) {
        if (injection.pluginElement.parentNode) {
          injection.pluginElement.parentNode.removeChild(injection.pluginElement);
        }
        this.injectedElements.delete(key);
      }
    }
    
    this.plugins.delete(pluginId);
  }

  // Load plugins from configuration
  async loadPlugins(pluginsConfig) {
    console.log('📦 Loading plugins with CSS selector configuration...');
    
    for (const plugin of pluginsConfig.plugins) {
      console.log(`📋 Processing plugin ${plugin.id}:`, {
        hasInjection: !!plugin.injection,
        isManual: plugin.behavior === 'manual',
        selector: plugin.injection?.selector,
        position: plugin.injection?.position
      });
      
      if (plugin.injection && plugin.injection.selector) {
        this.addPlugin(plugin);
        console.log(`✅ Added ${plugin.id} for CSS injection: ${plugin.injection.selector} (${plugin.injection.position})`);
      } else if (plugin.behavior === 'manual') {
        this.manualPlugins.set(plugin.id, plugin);
        console.log(`✅ Added ${plugin.id} for manual loading`);
      }
    }
    
    console.log('✅ Plugins loaded:', {
      autoInjected: this.plugins.size,
      manual: this.manualPlugins.size
    });
  }

  // Get manual plugins for UI
  getManualPlugins() {
    return Array.from(this.manualPlugins.values());
  }

  // Clean up the system
  destroy() {
    if (this.domObserver) {
      this.domObserver.disconnect();
    }
    
    if (this.isPatched && this.originalCreateElement) {
      React.createElement = this.originalCreateElement;
      this.isPatched = false;
    }
    
    // Clean up all injected elements
    for (const [key, injection] of this.injectedElements.entries()) {
      if (injection.pluginElement.parentNode) {
        injection.pluginElement.parentNode.removeChild(injection.pluginElement);
      }
    }
    this.injectedElements.clear();
    
    console.log('🧹 Universal React Tree Integrator cleaned up');
  }
}

// Global instance
export const universalTreeIntegrator = new UniversalReactTreeIntegrator();

// Simple test function to verify exports work
export const testFunction = () => {
  console.log('Test function called successfully');
  return [];
};

// Initialize and load plugins
export const loadPluginsWithReactIntegration = async () => {
  try {
    console.log('🚀 Starting Universal React Tree Integration...');
    
    // Initialize the integrator
    universalTreeIntegrator.initialize();
    
    // Load plugins configuration
    const response = await fetch('/plugins.json');
    const pluginsConfig = await response.json();
    
    // Load plugins into the integrator
    await universalTreeIntegrator.loadPlugins(pluginsConfig);
    
    console.log('✅ Universal React Tree Integration complete');
    return universalTreeIntegrator.getManualPlugins();
    
  } catch (error) {
    console.error('❌ Failed to load plugins with Universal React integration:', error);
    return [];
  }
};

export default universalTreeIntegrator;
