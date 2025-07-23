import React from "react";
import { CounterProvider } from "../src/contexts/CounterContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { PluginSystemProvider } from "../src/utils/PluginSystem";
import Header from "../src/components/Header";
import Sidebar from "../src/components/Sidebar";

const Home: React.FC = () => {
  return (
    <AuthProvider>
      <CounterProvider>
        <PluginSystemProvider
          pluginsUrl="http://localhost:3000/plugins.json"
          enableDelay={true}
          delayMs={5000}
        >
          <div className="app-container">
            <Header />
            <div className="app-content">
              <Sidebar />
              <main className="app-main">
                <h2 className="mt-0">Module Federation Demo</h2>
                <p>
                  Plugins will inject automatically into the page using DOM
                  selectors.
                </p>
              </main>
            </div>
          </div>
        </PluginSystemProvider>
      </CounterProvider>
    </AuthProvider>
  );
};

export default Home;
