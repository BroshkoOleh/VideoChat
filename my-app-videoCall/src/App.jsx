import React from "react";
import AppRoutes from "./AppRouters";
import { BrowserRouter as Router } from "react-router-dom";
import { VideoSDKProvider } from "./context/VideoSDKContext";

function App() {
  return (
    <Router>
      <VideoSDKProvider>
        <AppRoutes />
      </VideoSDKProvider>
    </Router>
  );
}

export default App;
