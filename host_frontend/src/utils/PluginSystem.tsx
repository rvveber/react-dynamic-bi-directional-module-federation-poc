import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
  Children,
  cloneElement,
  isValidElement,
  FC,
  ComponentType,
} from 'react';
import { createPortal } from 'react-dom';
import { loadRemote, init } from '@module-federation/runtime';

// Plugin configuration interface
interface PluginConfig {
  id: string;
  remote: string;
  componentName: string;
  selector: string;
  position: 'before' | 'after' | 'replace' | 'prepend' | 'append';
  scopeName: string;
  props?: Record<string, any>;
}

// External plugin configuration interface (from plugins.json)
interface ExternalPluginConfig {
  id: string;
  name: string;
  description: string;
  remote_url: string;
  module_name: string;
  scope_name: string;
  injection_config: {
    target_selector: string;
    injection_position: 'before' | 'after' | 'replace' | 'prepend' | 'append';
  };
}

// Transform external config to internal config
const transformPluginConfig = (external: ExternalPluginConfig): PluginConfig => ({
  id: external.id,
  remote: external.remote_url,
  componentName: external.module_name,
  selector: external.injection_config.target_selector,
  position: external.injection_config.injection_position,
  scopeName: external.scope_name,
  props: {},
});

// Plugin registry for managing loaded plugins
class PluginRegistry {
  private plugins = new Map<string, ComponentType<any>>();
  private loadedRemotes = new Set<string>();

  async loadPlugin(config: PluginConfig): Promise<ComponentType<any> | null> {
    try {
      // Initialize module federation runtime if not already done
      if (!this.loadedRemotes.has(config.remote)) {
        await init({
          name: 'host',
          remotes: [
            {
              name: config.scopeName,
              entry: config.remote,
            },
          ],
        });
        this.loadedRemotes.add(config.remote);
      }

      // Load the remote component
      const remoteModule = await loadRemote(`${config.scopeName}/${config.componentName}`) as any;
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

  getAllPlugins(): Map<string, ComponentType<any>> {
    return new Map(this.plugins);
  }
}

// Context for plugin system
interface PluginSystemContextType {
  registry: PluginRegistry;
  pluginConfigs: PluginConfig[];
  isLoading: boolean;
  error: string | null;
}

const PluginSystemContext = createContext<PluginSystemContextType | null>(null);

// Hook to access plugin system context
export const usePluginSystem = () => {
  const context = useContext(PluginSystemContext);
  if (!context) {
    throw new Error('usePluginSystem must be used within a PluginSystemProvider');
  }
  return context;
};

// Plugin wrapper component that preserves React context
interface PluginWrapperProps {
  config: PluginConfig;
  children?: ReactNode;
}

const PluginWrapper: FC<PluginWrapperProps> = ({ config, children }) => {
  const { registry } = usePluginSystem();
  const PluginComponent = registry.getPlugin(config.id);

  if (!PluginComponent) {
    console.warn(`Plugin component not found for ${config.id}`);
    return children || null;
  }

  // Render the plugin component with its props
  return <PluginComponent {...(config.props || {})} />;
};

// DOM-based plugin injector that works with static builds
class DOMPluginInjector {
  private pluginConfigs: PluginConfig[];
  private registry: PluginRegistry;
  private portals: Map<string, Element> = new Map();

  constructor(pluginConfigs: PluginConfig[], registry: PluginRegistry) {
    this.pluginConfigs = pluginConfigs;
    this.registry = registry;
  }

  // Wait for DOM to be ready
  private waitForDOM(): Promise<void> {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });
  }

  // Create container element for plugin injection
  private createPluginContainer(id: string): Element {
    const container = document.createElement('div');
    container.id = `plugin-container-${id}`;
    container.style.display = 'contents'; // Makes container invisible in layout
    return container;
  }

  // Inject plugins into DOM based on position
  private injectPlugin(config: PluginConfig): Element | null {
    const targetElement = document.querySelector(config.selector);
    if (!targetElement) {
      console.warn(`Target element not found for selector: ${config.selector}`);
      return null;
    }

    const container = this.createPluginContainer(config.id);
    
    switch (config.position) {
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
        (targetElement as HTMLElement).style.display = 'none'; // Hide original element
        break;
      default:
        console.warn(`Unknown position: ${config.position}`);
        return null;
    }

    return container;
  }

  // Initialize DOM injection
  async initializeInjection(): Promise<Map<string, Element>> {
    await this.waitForDOM();
    
    // Small delay to ensure React has finished rendering
    await new Promise(resolve => setTimeout(resolve, 100));

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

  // Clean up injected elements
  cleanup(): void {
    this.portals.forEach((container, id) => {
      container.remove();
    });
    this.portals.clear();
  }

  getPortals(): Map<string, Element> {
    return this.portals;
  }
}

// Countdown component for visual feedback
interface CountdownOverlayProps {
  secondsLeft: number;
}

const CountdownOverlay: FC<CountdownOverlayProps> = ({ secondsLeft }) => {
  if (secondsLeft <= 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Circular countdown */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#007acc',
        boxShadow: '0 8px 32px rgba(0, 122, 204, 0.3)',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '3px solid #007acc'
      }}>
        {secondsLeft}
      </div>
      
      {/* Subtitle */}
      <div style={{
        marginTop: '16px',
        fontSize: '16px',
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 16px',
        borderRadius: '4px'
      }}>
        Plugin injection starting...
      </div>
      
      {/* Description */}
      <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#999',
        textAlign: 'center',
        maxWidth: '240px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '4px 12px',
        borderRadius: '4px'
      }}>
        Plugins will automatically inject into the page
      </div>
    </div>
  );
};

// Plugin injection component that uses DOM-based injection
interface PluginInjectorProps {
  children: ReactNode;
}

const PluginInjector: FC<PluginInjectorProps> = ({ children }) => {
  const { pluginConfigs, isLoading, registry } = usePluginSystem();
  const [portals, setPortals] = useState<Map<string, Element>>(new Map());

  useEffect(() => {
    if (isLoading || pluginConfigs.length === 0) {
      return;
    }

    const injector = new DOMPluginInjector(pluginConfigs, registry);
    
    const initializeInjection = async () => {
      try {
        const portalContainers = await injector.initializeInjection();
        setPortals(portalContainers);
      } catch (error) {
        console.error('Failed to initialize DOM injection:', error);
      }
    };

    initializeInjection();

    return () => {
      injector.cleanup();
      setPortals(new Map());
    };
  }, [pluginConfigs, isLoading, registry]);

  // Force a key change when plugin system loads to trigger re-render
  const key = isLoading ? 'loading' : 'loaded';

  return (
    <div key={key}>
      {children}
      {/* Render plugins into DOM portals */}
      {Array.from(portals.entries()).map(([pluginId, container]) => {
        const config = pluginConfigs.find(c => c.id === pluginId);
        if (!config) return null;

        return createPortal(
          <PluginWrapper key={pluginId} config={config} />,
          container
        );
      })}
    </div>
  );
};

// Main provider component
interface PluginSystemProviderProps {
  children: ReactNode;
  pluginsUrl?: string;
  delayMs?: number; // Add configurable delay
  enableDelay?: boolean; // Toggle to enable/disable delay
}

export const PluginSystemProvider: FC<PluginSystemProviderProps> = ({
  children,
  pluginsUrl = 'http://localhost:3000/plugins.json',
  delayMs = 5000, // Default 5 second delay
  enableDelay = true, // Enable delay by default
}) => {
  const [registry] = useState(() => new PluginRegistry());
  const [pluginConfigs, setPluginConfigs] = useState<PluginConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're client-side for module federation
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const loadPlugins = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Add configurable delay before plugin injection with visual countdown
        if (enableDelay && delayMs > 0) {
          const totalSeconds = Math.ceil(delayMs / 1000);
          setCountdownSeconds(totalSeconds);
          
          // Update countdown every second
          const countdownInterval = setInterval(() => {
            setCountdownSeconds(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          // Wait for the full delay
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

        // Fetch plugin configurations from runtime discovery
        const response = await fetch(pluginsUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch plugins: ${response.statusText}`);
        }

        const data = await response.json();
        const externalConfigs: ExternalPluginConfig[] = data.plugins || [];
        const configs: PluginConfig[] = externalConfigs.map(transformPluginConfig);
        setPluginConfigs(configs);

        // Load all plugins in parallel
        const loadPromises = configs.map(config => registry.loadPlugin(config));
        await Promise.allSettled(loadPromises);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to initialize plugin system:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setCountdownSeconds(0);
      }
    };

    loadPlugins();
  }, [registry, pluginsUrl, delayMs, enableDelay, isClient]);

  // Don't render plugin system during SSR
  if (!isClient) {
    return <>{children}</>;
  }

  const contextValue: PluginSystemContextType = {
    registry,
    pluginConfigs,
    isLoading,
    error,
  };

  return (
    <PluginSystemContext.Provider value={contextValue}>
      {/* Show countdown overlay during delay */}
      {countdownSeconds > 0 && <CountdownOverlay secondsLeft={countdownSeconds} />}
      <PluginInjector>{children}</PluginInjector>
    </PluginSystemContext.Provider>
  );
};

export default PluginSystemProvider;