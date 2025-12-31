import React from 'react';
import { createRoot } from "react-dom/client";

// IMPORTANT: Import order matters!
// 1. Your Tailwind CSS must come FIRST
import "./index.css";

// 2. OnchainKit styles come AFTER
import '@coinbase/onchainkit/styles.css';

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
