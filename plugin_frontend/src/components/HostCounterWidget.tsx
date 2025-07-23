import React from "react";
import { useRemoteModule } from "../hooks/useRemoteModule";
import { PluginWidgetWrapper, LoadingState, ErrorState } from './SharedComponents';
import '../styles/components.css';

const HostCounterWidget: React.FC = () => {
  const { remoteModule: HostCounter, isLoading, error } = useRemoteModule({
    remote: "host_frontend",
    component: "CounterContext",
  });

  if (isLoading) {
    return <LoadingState message="Loading counter functionality..." />;
  }

  if (error || !HostCounter || !HostCounter.useCounter) {
    return <ErrorState message="Counter functionality is not available." />;
  }

  const { count, increment, decrement } = HostCounter.useCounter();

  return (
    <PluginWidgetWrapper
      title="Host Counter Widget"
      description="This component interacts with the host's counter state."
    >
      <div className="counter-container">
        <button onClick={() => decrement()} className="counter-button">
          -
        </button>
        <span className="counter-value">{count}</span>
        <button onClick={() => increment()} className="counter-button">
          +
        </button>
      </div>
    </PluginWidgetWrapper>
  );
};

export default HostCounterWidget;
