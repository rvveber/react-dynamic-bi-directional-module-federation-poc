import React from 'react';
import type { AppProps } from 'next/app';
import '../src/styles/globals.css';
import { PluginSystemDemoProvider } from '../src/utils/PluginSystemDemoProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/react-query';
import { AuthProvider } from '../src/contexts/AuthContext';
import { CounterProvider } from '../src/contexts/CounterContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CounterProvider>
          <PluginSystemDemoProvider>
            <Component {...pageProps} />
          </PluginSystemDemoProvider>
        </CounterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;