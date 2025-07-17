/**
 * Runtime Plugin für dynamische bidirektionale Module Federation
 * Identisch für alle Apps
 */
export default function () {
  return {
    name: 'dynamic-bidirectional-plugin',
    init(args) {
      console.log('🔄 Dynamic Bidirectional Plugin initializing...', args);
      
      // Check if we're in a plugin that wants to access the host
      const isPlugin = args.options.name !== 'app1';
      
      if (isPlugin) {
        // For plugins: Ensure they can access the host dynamically
        const hostRemote = args.options.remotes?.find(remote => 
          remote.name === 'app1' || remote.alias === 'app1'
        );
        
        if (hostRemote) {
          console.log('🔌 Plugin found host remote:', hostRemote);
        } else {
          // Dynamically add host remote if not present
          if (!args.options.remotes) {
            args.options.remotes = [];
          }
          
          args.options.remotes.push({
            name: 'app1',
            alias: 'app1',
            entry: 'http://localhost:3001/remoteEntry.js'
          });
          
          console.log('✅ Added dynamic host remote for plugin', args.options.name);
        }
      }
      
      return args;
    }
  };
}
