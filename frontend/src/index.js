// Entry point for the Preply React Frontend application.
// Mounts the root React component (App.jsx) onto the DOM container with ID 'root'.

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
