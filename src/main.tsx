import { StrictMode } from "react";
import "./i18n";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <React.Suspense fallback={<div className="h-screen w-full bg-brand-500" />}>
      <App />
    </React.Suspense>
  </StrictMode>,
);
