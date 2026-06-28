import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { env } from "@/config/env";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<FullScreenLoader />}>
      <GoogleOAuthProvider clientId={env.googleClientId}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Suspense>
  </StrictMode>,
);
