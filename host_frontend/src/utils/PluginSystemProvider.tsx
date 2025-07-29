import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  ComponentType,
} from 'react';
import { createPortal } from 'react-dom';
import { loadRemote, init } from '@module-federation/runtime';

/**
 * Plugin configuration interface - matches plugins.json structure directly
 */
export interface PluginConfig {
  id: string;
  remote_url: string;
  remote_name: string;
  remote_component: string;
  injection_config: {
    target_selector: string;
    injection_position: 'before' | 'after' | 'replace' | 'prepend' | 'append';
  };
  props?: Record<string, any>;
}

/**
 * Plugin registry manages loading and storing plugin components
 */
export class PluginRegistry {
  private plugins = new Map<string, ComponentType<any>>();
  private loadedRemotes = new Set<string>();

  async loadPlugin(config: PluginConfig): Promise<ComponentType<any> | null> {
    try {
      // Initialize module federation runtime for this remote
      if (!this.loadedRemotes.has(config.remote_url)) {
        await init({
          name: 'host',
          remotes: [{ name: config.remote_name, entry: config.remote_url }],
        });
        this.loadedRemotes.add(config.remote_url);
      }

      // Load the remote component
      const remoteModule = await loadRemote(`${config.remote_name}/${config.remote_component}`) as any;
      const PluginComponent = remoteModule.default || remoteModule;
      
      if (PluginComponent) {
        this.plugins.set(config.id, PluginComponent);
        return PluginComponent;
      }
    } catch (error) {
      console.error(`Failed to load plugin ${config.id}:`, error);
    }
    return null;
  }

  getPlugin(id: string): ComponentType<any> | undefined {
    return this.plugins.get(id);
  }
}

/**
 * Context for plugin system state
 */
interface PluginSystemContextType {
  registry: PluginRegistry;
  pluginConfigs: PluginConfig[];
  isLoading: boolean;
  error: string | null;
}

const PluginSystemContext = createContext<PluginSystemContextType | null>(null);

/**
 * Hook to access plugin system context
 */
export const usePluginSystem = () => {
  const context = useContext(PluginSystemContext);
  if (!context) {
    throw new Error('usePluginSystem must be used within a PluginSystemProvider');
  }
  return context;
};

/**
 * Plugin wrapper component that renders loaded plugins
 */
interface PluginWrapperProps {
  config: PluginConfig;
}

const PluginWrapper: FC<PluginWrapperProps> = ({ config }) => {
  const { registry } = usePluginSystem();
  const PluginComponent = registry.getPlugin(config.id);

  if (!PluginComponent) {
    console.warn(`Plugin component not found for ${config.id}`);
    return null;
  }

  return <PluginComponent {...(config.props || {})} />;
};

/**
 * DOM injection utility for placing plugins in the correct positions
 */
class DOMPluginInjector {
  private pluginConfigs: PluginConfig[];
  private registry: PluginRegistry;
  private portals: Map<string, Element> = new Map();

  constructor(pluginConfigs: PluginConfig[], registry: PluginRegistry) {
    this.pluginConfigs = pluginConfigs;
    this.registry = registry;
  }

  /**
   * Wait for DOM to be ready
   */
  private waitForDOM(): Promise<void> {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });
  }

  /**
   * Create invisible container for plugin injection
   */
  private createPluginContainer(id: string): Element {
    const container = document.createElement('div');
    container.id = `plugin-container-${id}`;
    container.style.display = 'contents';
    return container;
  }

  /**
   * Inject plugin container at specified position relative to target element
   */
  private injectPlugin(config: PluginConfig): Element | null {
    const targetElement = document.querySelector(config.injection_config.target_selector);
    if (!targetElement) {
      console.warn(`Target element not found for selector: ${config.injection_config.target_selector}`);
      return null;
    }

    const container = this.createPluginContainer(config.id);
    
    switch (config.injection_config.injection_position) {
      case 'before':
        targetElement.parentNode?.insertBefore(container, targetElement);
        break;
      case 'after':
        targetElement.parentNode?.insertBefore(container, targetElement.nextSibling);
        break;
      case 'prepend':
        targetElement.insertBefore(container, targetElement.firstChild);
        break;
      case 'append':
        targetElement.appendChild(container);
        break;
      case 'replace':
        targetElement.parentNode?.insertBefore(container, targetElement);
        (targetElement as HTMLElement).style.display = 'none';
        break;
      default:
        console.warn(`Unknown position: ${config.injection_config.injection_position}`);
        return null;
    }

    return container;
  }

  /**
   * Initialize DOM injection for all configured plugins
   */
  async initializeInjection(): Promise<Map<string, Element>> {
    await this.waitForDOM();
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow React to finish rendering

    const containers = new Map<string, Element>();

    this.pluginConfigs.forEach(config => {
      const container = this.injectPlugin(config);
      if (container) {
        containers.set(config.id, container);
        this.portals.set(config.id, container);
      }
    });

    return containers;
  }

  /**
   * Clean up injected elements
   */
  cleanup(): void {
    this.portals.forEach((container) => {
      container.remove();
    });
    this.portals.clear();
  }
}

/**
 * Production-ready plugin system provider
 * Contains all the essential plugin loading logic without any demo features
 */
interface PluginSystemProviderProps {
  children: ReactNode;
  pluginsUrl?: string;
}

export const PluginSystemProvider: FC<PluginSystemProviderProps> = ({
  children,
  pluginsUrl = '/plugins.json',
}) => {
  const [registry] = useState(() => new PluginRegistry());
  const [pluginConfigs, setPluginConfigs] = useState<PluginConfig[]>([]);
  const [portals, setPortals] = useState<Map<string, Element>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlugins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading plugins from:', pluginsUrl);
        
        // 1. Fetch plugin configurations
        const response = await fetch(pluginsUrl);
        if (!response.ok) throw new Error('Failed to fetch plugin configurations');
        const data = await response.json();
        const configs: PluginConfig[] = data.plugins || [];
        setPluginConfigs(configs);

        // 2. Load all plugin components
        await Promise.all(configs.map(config => registry.loadPlugin(config)));

        // 3. Initialize DOM injection
        const injector = new DOMPluginInjector(configs, registry);
        const portalContainers = await injector.initializeInjection();
        setPortals(portalContainers);

        console.log('Plugins loaded successfully');
      } catch (e: any) {
        setError(e.message);
        console.error("Plugin system error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadPlugins();
    }
  }, [pluginsUrl, registry]);

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        Error loading plugins: {error}
      </div>
    );
  }

  return (
    <PluginSystemContext.Provider value={{ registry, pluginConfigs, isLoading, error }}>
      {/* Render host application immediately */}
      {children}

      {/* Render plugins into their portal containers once loaded */}
      {Array.from(portals.entries()).map(([id, container]) => {
        const config = pluginConfigs.find(p => p.id === id);
        if (!config) return null;
        return createPortal(
          <PluginWrapper key={id} config={config} />, 
          container
        );
      })}
    </PluginSystemContext.Provider>
  );
};
