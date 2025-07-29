import React, { useEffect, useState } from "react";
import { useRemoteModule } from "../hooks/useRemoteModule";
import { PluginWidgetWrapper } from './common';
import { LoadingState, ErrorState } from 'host_frontend/common';
import type { QueryClient, QueryCacheNotifyEvent } from '@tanstack/react-query';
import '../styles/components.css';

const HostDataWidget: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { remoteModule: HostQueryLib, isLoading, error } = useRemoteModule({
    remote: "host_frontend",
    component: "queryClient",
  });

  useEffect(() => {
    if (HostQueryLib?.queryClient) {
      const queryClient: QueryClient = HostQueryLib.queryClient;

      // Set initial state
      const initialData = queryClient.getQueryData(['auth', 'status']);
      setAuthStatus(initialData);

      // Subscribe to cache changes for reactivity
      const unsubscribe = queryClient.getQueryCache().subscribe((event: QueryCacheNotifyEvent) => {
        if (event.query.queryKey[0] !== 'auth') return;

        if (event.type === 'updated') {
          if (event.action.type === 'fetching') {
            setIsFetching(true);
          } else {
            setIsFetching(false);
            setAuthStatus(event.query.state.data);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [HostQueryLib]);

  if (!isClient || isLoading) {
    return <LoadingState message="Loading host data layer..." />;
  }

  if (error || !HostQueryLib?.queryClient) {
    return <ErrorState message="Host queryClient is not available." />;
  }

  const queryClient: QueryClient = HostQueryLib.queryClient;

  return (
    <PluginWidgetWrapper
      title="HostDataWidget (from Plugin)"
      description="Interacts directly with the host's queryClient."
    >
      <div style={{ marginTop: "12px", color: '#f57c00', transition: 'opacity 0.3s', opacity: isFetching ? 0.5 : 1 }}>
        <strong>Status:</strong> {authStatus?.authenticated ? '✅ Authenticated' : '❌ Not authenticated'}
        <br />
        <strong>Message:</strong> {authStatus?.message || '⏳ Loading...'}
        {isFetching && <div style={{ fontSize: '12px', fontStyle: 'italic' }}> (Updating...)</div>}
      </div>
    </PluginWidgetWrapper>
  );
};

export default HostDataWidget;
