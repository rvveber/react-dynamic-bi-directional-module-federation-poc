import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { PluginSystemProvider } from './PluginSystemProvider';

/**
 * Countdown overlay component to visually demonstrate delayed injection
 * This is DEMO-ONLY and should be removed in production
 */
interface CountdownOverlayProps {
  onComplete: () => void;
}

const CountdownOverlay: FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState(5); // Start countdown from 5

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      flexDirection: 'column',
      color: '#000',
    }}>
      <h2>Injecting plugins in...</h2>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>{count}</h1>
    </div>
  );
};

/**
 * Demo wrapper component that adds countdown functionality
 * This is DEMO-ONLY and should NOT be used in production
 * 
 * For production, use PluginSystemProvider directly
 */
interface PluginSystemDemoProviderProps {
  children: ReactNode;
  pluginsUrl?: string;
}

export const PluginSystemDemoProvider: FC<PluginSystemDemoProviderProps> = ({
  children,
  pluginsUrl = '/plugins.json',
}) => {
  const [showCountdown, setShowCountdown] = useState(true);

  const handleCountdownComplete = useCallback(() => {
    console.log('Countdown complete, starting plugin load');
    setShowCountdown(false);
  }, []);

  return (
    <>
      {/* Only show the production plugin system after countdown completes */}
      {!showCountdown && (
        <PluginSystemProvider pluginsUrl={pluginsUrl}>
          {children}
        </PluginSystemProvider>
      )}

      {/* Show just the host app during countdown */}
      {showCountdown && children}

      {/* Demo countdown overlay */}
      {showCountdown && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
    </>
  );
};
