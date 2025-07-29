import React from "react";
import Header from "../src/components/Header";
import Sidebar from "../src/components/Sidebar";

const Home: React.FC = () => {
  return (
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
  );
};

export default Home;
