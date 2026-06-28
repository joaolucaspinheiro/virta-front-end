import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/** Rotas só para visitantes (login, cadastro...). Se já logado, vai ao dashboard. */
export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to={paths.dashboard} replace />;
  return <Outlet />;
}
