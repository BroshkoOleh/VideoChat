import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { VideoSDKProvider } from "./context/VideoSDKContext";
import AppContent from "./components/AppContent/AppContent";

function App() {
  return (
    <Router>
      <VideoSDKProvider>
        <AppContent />
      </VideoSDKProvider>
    </Router>
  );
}

export default App;
