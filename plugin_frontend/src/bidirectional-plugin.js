/**
 * Bidirectional Runtime Plugin
 * 
 * This plugin enables plugins to dynamically import host components
 * without the host needing to know about this at build time.
 * 
 * Core functionality:
 * 1. For plugins: automatically register the host as a remote
 * 2. For the host: ensure proper sharing configuration
 */
export default function() {
  return {
    name: 'bidirectional-plugin',
    init(args) {
      console.log('🔄 Bidirectional Plugin initializing for:', args.options?.name);
      
      // If this is a plugin (not the host), ensure it can access the host
      const isPlugin = args.options?.name !== 'host_frontend';
      
      if (isPlugin) {
        // Ensure host remote is available for bidirectional access
        const existingHostRemote = args.options.remotes?.find(remote => 
          remote.name === 'host_frontend' || remote.alias === 'host_frontend'
        );
        
        if (!existingHostRemote) {
          // Dynamically add host remote if not already configured
          if (!args.options.remotes) {
            args.options.remotes = [];
          }
          
          args.options.remotes.push({
            name: 'host_frontend',
            alias: 'host_frontend', 
            entry: 'http://localhost:3001/remoteEntry.js'
          });
          
          console.log('✅ Added bidirectional host remote for plugin:', args.options.name);
        } else {
          console.log('✅ Host remote already configured for plugin:', args.options.name);
        }
      }
      
      return args;
    }
  };
}
