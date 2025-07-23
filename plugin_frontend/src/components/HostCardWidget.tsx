import React from 'react';
import { useRemoteModule } from '../hooks/useRemoteModule';
import { PluginWidgetWrapper, LoadingState, ErrorState } from './SharedComponents';
import '../styles/components.css';

const HostCardWidget: React.FC = () => {
  const { remoteModule: HostCard, isLoading, error } = useRemoteModule({
    remote: "host_frontend",
    component: "Card",
  });

  if (isLoading) {
    return <LoadingState message="Loading host card component..." />;
  }

  if (error || !HostCard) {
    return <ErrorState message="Host card component unavailable" />;
  }

  return (
    <PluginWidgetWrapper
      title="Plugin Widget"
      description="Bidirectional module federation demo"
    >
      <div style={{ marginTop: '12px' }}>
        <HostCard title="Plugin Using Host Component">
          <span style={{ color: '#ff9800' }}>This card is defined in host but rendered by plugin</span>
        </HostCard>
      </div>
    </PluginWidgetWrapper>
  );
};

export default HostCardWidget;
