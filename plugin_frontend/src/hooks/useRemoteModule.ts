import { useState, useEffect } from 'react';
import { loadRemote } from '@module-federation/runtime';

interface RemoteModuleHookOptions {
  remote: string;
  component: string;
}

export const useRemoteModule = (options: RemoteModuleHookOptions) => {
  const [remoteModule, setRemoteModule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRemote(`${options.remote}/${options.component}`)
      .then((module: any) => {
        setRemoteModule(() => module.default || module);
      })
      .catch((err: Error) => {
        console.error(`Failed to load remote module ${options.remote}/${options.component}:`, err);
        setError(`Cannot load ${options.component}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [options.remote, options.component]);

  return { remoteModule, isLoading, error };
};
