import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { env } from "@/config/env";

function Root() {
  const { i18n } = useTranslation();
  // O texto do botão do Google segue o idioma do app. A `key` força recarregar
  // o script do GIS quando o usuário troca PT/EN.
  const locale = i18n.language.startsWith("en") ? "en" : "pt-BR";

  return (
    <GoogleOAuthProvider
      key={locale}
      clientId={env.googleClientId}
      locale={locale}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<FullScreenLoader />}>
      <Root />
    </Suspense>
  </StrictMode>,
);
